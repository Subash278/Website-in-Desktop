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
    console.log('Fetching MITRE ATT&CK data...');
    
    // Fetch enterprise attack data from MITRE CTI repository
    const response = await fetch(
      'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch MITRE data: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract attack patterns (techniques)
    const techniques = data.objects
      .filter((obj: any) => obj.type === 'attack-pattern' && !obj.revoked && !obj.deprecated)
      .map((tech: any) => {
        // Extract tactic from kill chain phases
        const tactic = tech.kill_chain_phases?.[0]?.phase_name || 'unknown';
        
        // Map severity based on tactic (simplified)
        const severityMap: Record<string, string> = {
          'initial-access': 'Critical',
          'execution': 'High',
          'persistence': 'High',
          'privilege-escalation': 'Critical',
          'defense-evasion': 'High',
          'credential-access': 'Critical',
          'discovery': 'Medium',
          'lateral-movement': 'High',
          'collection': 'Medium',
          'command-and-control': 'High',
          'exfiltration': 'Critical',
          'impact': 'Critical',
        };

        return {
          id: tech.id,
          mitreId: tech.external_references?.find((ref: any) => ref.source_name === 'mitre-attack')?.external_id || 'N/A',
          technique: tech.name,
          tactic: tactic.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: tech.description || 'No description available',
          severity: severityMap[tactic] || 'Medium',
        };
      })
      .slice(0, 100); // Limit to first 100 techniques

    console.log(`Successfully fetched ${techniques.length} MITRE ATT&CK techniques`);

    return new Response(
      JSON.stringify({ techniques, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-mitre-attack function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
