import { turso } from '../src/lib/turso';
import fs from 'fs';

async function performSovereignAudit() {
  console.log("--- 🏛️ MATRIARCH SOVEREIGN RANK AUDIT ---");
  const reportPath = './audit_report.json';
  
  try {
    // 1. Population Census
    const census = await turso.execute("SELECT count(*) as total, count(DISTINCT absolute_rank) as unique_ranks, max(absolute_rank) as max_rank FROM profiles WHERE role = 'man'");
    const { total, unique_ranks, max_rank } = census.rows[0];
    
    // 2. Anomaly Detection
    const anomalies999 = await turso.execute("SELECT count(*) as c FROM profiles WHERE role = 'man' AND absolute_rank = 999");
    const outOfBounds = await turso.execute(`SELECT count(*) as c FROM profiles WHERE role = 'man' AND absolute_rank > ${total}`);
    
    // 3. Logic Sampling (Top 5)
    const top5 = await turso.execute("SELECT full_name, is_verified, rank_score, absolute_rank FROM profiles WHERE role = 'man' ORDER BY absolute_rank ASC LIMIT 5");
    
    // 4. Duplicate Detection
    const dups = await turso.execute("SELECT absolute_rank, count(*) as c FROM profiles WHERE role = 'man' GROUP BY absolute_rank HAVING c > 1");
    
    const results = {
      timestamp: new Date().toISOString(),
      census: { total, unique_ranks, max_rank },
      integrity: {
        is_exclusive: total === unique_ranks,
        max_rank_consistency: total === max_rank,
        anomalies_999: anomalies999.rows[0].c,
        out_of_bounds: outOfBounds.rows[0].c,
        duplicates: dups.rows
      },
      top_tier: top5.rows
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`AUDIT_CERTIFIED: Results logged to ${reportPath}`);
    
    // Summary
    console.log(`\nCensus: ${total} aspirants found.`);
    if (total === unique_ranks) {
      console.log("✅ EXCLUSIVITY: All ranks are strictly unique.");
    } else {
      console.log("❌ DISCREPANCY: Non-unique ranks detected.");
    }
    
    if (results.integrity.anomalies_999 === 0) {
      console.log("✅ PURGE STATUS: Zero Rank-999 remnants detected.");
    } else {
      console.log(`⚠️ ANOMALY: ${results.integrity.anomalies_999} profiles stuck at Rank 999.`);
    }

  } catch (err) {
    console.error("AUDIT_CRITICAL_FAILURE:", err.message);
  }
}

performSovereignAudit();
