import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching NVD CVE data...');
    
    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Fetch recent CVEs from NVD API
    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${startDateStr}T00:00:00.000&pubEndDate=${endDateStr}T23:59:59.999&resultsPerPage=50`;
    
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch NVD data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform CVE data
    const vulnerabilities = data.vulnerabilities?.map((item: any) => {
      const cve = item.cve;
      const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0];
      const cvssScore = metrics?.cvssData?.baseScore || 0;
      
      // Determine severity based on CVSS score
      let severity = 'Low';
      if (cvssScore >= 9.0) severity = 'Critical';
      else if (cvssScore >= 7.0) severity = 'High';
      else if (cvssScore >= 4.0) severity = 'Medium';
      
      // Determine status (random for demo)
      const statuses = ['Open', 'Mitigated', 'Patched'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Extract affected products
      const configurations = cve.configurations?.[0]?.nodes?.[0]?.cpeMatch || [];
      const affectedProduct = configurations[0]?.criteria?.split(':')[4] || 'Various Products';

      return {
        id: cve.id,
        cveId: cve.id,
        description: cve.descriptions?.find((d: any) => d.lang === 'en')?.value || 'No description available',
        severity,
        cvssScore,
        affectedProduct,
        status,
      };
    }) || [];

    console.log(`Successfully fetched ${vulnerabilities.length} CVEs`);

    return new Response(
      JSON.stringify({ vulnerabilities, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-nvd-cves function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
