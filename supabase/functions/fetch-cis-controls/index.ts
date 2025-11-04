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
    console.log('Fetching CIS Controls and NIST CSF data...');
    
    // Since CIS Controls are typically paid content, we'll fetch NIST CSF from GitHub
    // and create a structured controls list
    const nistResponse = await fetch(
      'https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json'
    );

    if (!nistResponse.ok) {
      throw new Error(`Failed to fetch NIST data: ${nistResponse.status}`);
    }

    const nistData = await nistResponse.json();
    
    // Extract controls from NIST catalog
    const controls = [];
    const catalog = nistData.catalog;
    
    // Process control groups
    for (const group of catalog.groups || []) {
      for (const control of (group.controls || []).slice(0, 10)) { // Limit per group
        controls.push({
          id: control.id,
          name: control.title,
          description: control.params?.[0]?.label || control.parts?.[0]?.prose || 'No description available',
          framework: 'NIST CSF',
          category: group.title || 'General',
          implemented: Math.random() > 0.5, // Random for demo
        });
      }
      
      if (controls.length >= 50) break; // Limit total controls
    }

    // Add some CIS Controls examples (public information)
    const cisControls = [
      {
        id: 'CIS-1',
        name: 'Inventory and Control of Enterprise Assets',
        description: 'Actively manage all enterprise assets connected to the infrastructure ensuring that only authorized assets are given access.',
        framework: 'CIS Controls',
        category: 'Asset Management',
        implemented: true,
      },
      {
        id: 'CIS-2',
        name: 'Inventory and Control of Software Assets',
        description: 'Actively manage all software on the network so that only authorized software is installed and can execute.',
        framework: 'CIS Controls',
        category: 'Asset Management',
        implemented: true,
      },
      {
        id: 'CIS-3',
        name: 'Data Protection',
        description: 'Develop processes and technical controls to identify, classify, securely handle, retain, and dispose of data.',
        framework: 'CIS Controls',
        category: 'Data Security',
        implemented: false,
      },
      {
        id: 'CIS-4',
        name: 'Secure Configuration of Enterprise Assets and Software',
        description: 'Establish and maintain the secure configuration of enterprise assets and software.',
        framework: 'CIS Controls',
        category: 'Configuration Management',
        implemented: true,
      },
      {
        id: 'CIS-5',
        name: 'Account Management',
        description: 'Use processes and tools to assign and manage authorization to credentials for user accounts.',
        framework: 'CIS Controls',
        category: 'Access Control',
        implemented: false,
      },
    ];

    const allControls = [...cisControls, ...controls.slice(0, 45)]; // Mix CIS and NIST

    console.log(`Successfully fetched ${allControls.length} controls`);

    return new Response(
      JSON.stringify({ controls: allControls, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-cis-controls function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
