import { createClient } from '@libsql/client';

const turso = createClient({
  url: "libsql://matriarch-metachasm-beep.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzUzMjAzMzIsImlkIjoiMDE5ZDU5NTMtYzAwMS03YjhkLTkzZDYtZDM3YzMzN2EzMDVkIiwicmlkIjoiN2IyY2ExMzctZmU4NC00YTQ5LWJiZjctYWYyODQzZWIxNDlmIn0.7PIfrrat-NpZDA7p3Ewsku2DtNuMwvKsGpHhQTp43i06mh44NLj4a5uaL69lPwocH-VyXBc6cqw7ccO0AduQAg"
});

async function checkSchema() {
  const result = await turso.execute("PRAGMA table_info(profiles)");
  console.log(JSON.stringify(result.rows.map(r => r.name), null, 2));
}

checkSchema().catch(console.error);
