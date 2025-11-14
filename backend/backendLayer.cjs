const express = require("express");
const axios = require("axios");
const cors = require("cors");
 
 
const multer = require("multer");
const fs = require("fs");
 
const upload = multer({ dest: "uploads/" });
 
const app = express();
app.use(express.json());
app.use(cors()); // allow requests from frontend
 
 
// ===== Keycloak + Camunda Config =====
const KEYCLOAK_TOKEN_URL =
  "http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token";
const CLIENT_ID = "orchestration";
const CLIENT_SECRET = "secret";
const CAMUNDA_API_URL = "http://localhost:8088/v2";
 
async function getAccessToken(req) {
  const authHeader = req.headers.authorization || req.get("Authorization");
  let token;

  if (authHeader) {
    token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    console.log("Using token from incoming Authorization header");
  } else {
      return null;
  }

  return token;
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt for user:", username);
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("username", username);
    params.append("password", password);

    const { data } = await axios.post(KEYCLOAK_TOKEN_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.json(data.access_token);
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    res.status(401).json({ error: err.response?.data || "Invalid credentials" });
  }
});


 
// ===== API endpoint to start a Camunda process =====
app.post("/start-process", async (req, res) => {
 const {processDefinitionId, processDefinitionVersion, variables} = req.body;
  try {

    const token = await getAccessToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No access token provided" });
    }

    const response = await axios.post(
      `${CAMUNDA_API_URL}/process-instances`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
   
    res.json({ message: "Process started successfully", processInstanceKey : response.data.processInstanceKey });
 
    } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});
 
// Search user tasks
app.post("/user-tasks/search", async (req, res) => {
  
  const { processInstanceKey, name } = req.body;

  const token = await getAccessToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }

  try {
    const response = await axios.post(
      `${CAMUNDA_API_URL}/user-tasks/search`,
      {
        filter: {
          name: name,
          processInstanceKey: processInstanceKey
        },
        "page": {
          "from": 0,
          "limit": 100
        }},
      { headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
 
    // ✅ Log formatted message to backend console
    console.log("✅ User Task retreived successfully:");
    console.log(JSON.stringify(response.data, null, 2));
 
    const items = response.data.items || [];
    if (items.length > 0) {
      const userTaskKey = items[0].userTaskKey;
      console.log('✅ Found userTaskKey:', userTaskKey);
      res.json({ userTaskKey });
    } else {
      console.log('⚠️ No active user tasks found');
      res.status(404).json({ message: 'No active user tasks found' });
    }
  } catch (error) {
    console.error('❌ Error fetching user task:', error.message);
    res.status(500).json({ error: 'Failed to fetch user task' });
  }
});
 
 
 // Search user tasks by user id
 app.post("/user-tasks/searchbyUser", async (req, res) => {
 
  const token = await getAccessToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }

  try {
 
    const response = await axios.post(
      `${CAMUNDA_API_URL}/user-tasks/search`,
      {
          // Search filter
          filter: {
            state: "CREATED",
            // Optional: state, assignee, candidateGroups
            // state: ["CREATED", "ASSIGNED"],
            assignee: "demo"
      
          },
            // Optional: pagination
          //  sorting: [{ sortBy: "createdAt", sortOrder: "asc" }],
            "page": {
        "from": 0,
        "limit": 100
      }
 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
 
 // ✅ Log formatted message to backend console
    console.log("✅ User Task retreived successfully:");
    console.log(JSON.stringify(response.data, null, 2));
 
    const items = response.data.items || [];
        if (items.length > 0) {
          const userTaskKey = items[0].userTaskKey;
          const taskname =
          console.log('✅ Found userTaskKey:', userTaskKey);
          res.json({userTaskKey});
          } else {
          console.log('⚠️ No active user tasks found');
          res.status(404).json({ message: 'No active user tasks found' });
        }
      } catch (error) {
        console.error('❌ Error fetching user task:', error.message);
        res.status(500).json({ error: 'Failed to fetch user task' });
      }
    });
 
    //Complete a User task
 
    // ===== Complete a user task =====
app.post("/complete-user-task", async (req, res) => {
  const { userTaskKey, variables } = req.body;
 
  const token = await getAccessToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }
 
  try {

    const response = await axios.post(
      `${CAMUNDA_API_URL}/user-tasks/${userTaskKey}/completion`,
      { variables }, // process variables to pass on completion
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );
 
    return res.json({
      message: "User task completed successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      err.response?.data || err.message
    );
 
    return res.status(500).json({
      message: "Failed to complete user task",
      error: err.response?.data || err.message,
    });
  }
});
 
// Example: GET task variables from Camunda/Zeebe
app.post('/user-tasks/:userTaskKey/variables', async (req, res) => {
  const { userTaskKey } = req.params;

  const token = await getAccessToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }
 
  try {
 
    const camundaResponse = await axios.post(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/variables/search`,
      {}, // body of POST request (empty JSON)
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }
    );
 
    res.json(camundaResponse.data); // axios stores response in .data
  } catch (err) {
    console.error('Failed to fetch task variables', err);
    res.status(500).json({ error: 'Failed to fetch task variables' });
  }
});
/*
// Example: GET form variables from Camunda/Zeebe
app.get('/:userTaskKey/form', async (req, res) => {
  const { userTaskKey } = req.params;
 
  try {
    const token = await getAccessToken(); // your function to get the Camunda token
    console.log('🔹 Fetching form for userTaskKey:', userTaskKey);
 
    // ❌ Problem in your code: axios.get() doesn’t take 3 arguments
    // ✅ Correct call: only 2 arguments (URL, config)
    const camundaResponse = await axios.get(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/form`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
 
    const camundaData = camundaResponse.data;
 
    // 🧩 The Camunda API returns something like:
    // {
    //   "schema": "{ \"id\": \"SelectOPD_IPD\", ... }",
    //   "metadata": {...}
    // }
 
    let schema = camundaData.schema;
 
    // ✅ Parse stringified schema safely
    if (typeof schema === 'string') {
      try {
        schema = JSON.parse(schema);
      } catch (parseErr) {
        console.error('❌ Failed to parse Camunda form schema:', parseErr);
        return res.status(500).json({ error: 'Failed to parse form schema' });
      }
    }
 
    // ✅ Send a clean JSON response to Angular
    res.json({
      schema,
      variables: {}, // You can optionally include form data or variables here
    });
 
    console.log('✅ Form sent to frontend successfully');
  } catch (err) {
    console.error('❌ Failed to fetch Camunda form:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch Camunda form' });
  }
});
*/
/*
app.get('/:userTaskKey/form', async (req, res) => {
  const { userTaskKey } = req.params;
 
  try {
    const token = await getAccessToken();
 
    // Fetch form schema
    const formRes = await axios.get(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/form`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
 
 // 2️⃣ Fetch variables via the new POST /variables/search endpoint
    const varsRes = await axios.post(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/variables/search`,
      {
       
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
 
   // 3️⃣ Parse schema if needed
    let schema = formRes.data.schema;
    if (typeof schema === 'string') {
      try {
        schema = JSON.parse(schema);
      } catch (err) {
        console.error('❌ Failed to parse form schema:', err);
        return res.status(500).json({ error: 'Invalid schema JSON' });
      }
    }
 
    // 4️⃣ Transform variables to simple key-value pairs
    const variables = {};
    if (Array.isArray(varsRes.data)) {
      for (const v of varsRes.data) {
        variables[v.name] = v.value;
      }
    } else if (typeof varsRes.data === 'object') {
      // Some Camunda versions return { items: [...] }
      const items = varsRes.data.items || [];
      for (const v of items) {
        variables[v.name] = v.value;
      }
    }
 
    // 5️⃣ Return schema and variables to frontend
    res.json({ schema, variables });
 
    console.log('✅ Sent form + variables to frontend for', userTaskKey);
  } catch (err) {
    console.error('❌ Failed to fetch Camunda form:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch Camunda form' });
  }
});
*/
 
 
app.get('/:userTaskKey/form', async (req, res) => {
  const { userTaskKey } = req.params;
  
  const token = await getAccessToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }

  try {
 
    // 1️⃣ Fetch form schema from Camunda
    const formRes = await axios.get(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/form`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
 
    let formSchema = formRes.data.schema;
 
    // 2️⃣ Safely parse schema if it is a string
    if (typeof formSchema === 'string') {
      try {
        formSchema = JSON.parse(formSchema);
      } catch (err) {
        console.warn('⚠️ Schema string is not valid JSON, trying to clean up...');
        try {
          // Remove newline/escape characters sometimes returned
          formSchema = JSON.parse(formSchema.replace(/\\n/g, '').replace(/\\'/g, "'"));
        } catch (err2) {
          console.error('❌ Failed to parse schema JSON:', err2);
          return res.status(500).json({ error: 'Invalid schema JSON' });
        }
      }
    }
 
    // 3️⃣ Fetch all variables for this task
    const varsRes = await axios.post(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/variables/search`,
      {  },
      { headers: { Authorization: `Bearer ${token}` } }
    );
 
    // 4️⃣ Flatten variables into simple key:value object
    const variables = {};
    if (Array.isArray(varsRes.data)) {
      varsRes.data.forEach(v => {
        variables[v.name] = v.value;
      });
    } else if (varsRes.data?.items) {
      varsRes.data.items.forEach(v => {
        variables[v.name] = v.value;
      });
    }
 
    // 5️⃣ Return schema + variables
    res.json({ schema: formSchema, variables });
    console.log('✅ Form schema and variables sent to frontend');
 
  } catch (err) {
    console.error('❌ Failed to fetch form:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to fetch Camunda form' });
  }
});
 
//upload files
app.post("/upload/:userTaskKey", upload.array("files"), async (req, res) => {
  const { userTaskKey } = req.params;

  const token = await getAccessToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }
 
  try {
 
    // Convert uploaded files to base64 to store in memory (no document storage)
    const uploadedFiles = req.files.map((file) => {
      const fileBuffer = fs.readFileSync(file.path);
      const base64Content = fileBuffer.toString("base64");
 
      // Delete temp file to keep things clean
      fs.unlinkSync(file.path);
 
      return {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        content: base64Content,
      };
    });
 
    // Build completion payload
    const payload = {
      action: "complete",
      variables: {
        uploadedFiles: {
          value: JSON.stringify(uploadedFiles),
          type: "String",
        },
      },
    };
 
    // Send to Camunda REST API
    const camundaResponse = await axios.post(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/completion`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
 
    console.log("✅ Task completed with uploaded files:", uploadedFiles);
    res.json({
      message: "Task completed successfully with uploaded files",
      uploadedFiles,
      camundaResponse: camundaResponse.data,
    });
  } catch (err) {
    console.error("❌ Failed to complete user task:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to complete user task",
      details: err.response?.data || err.message,
    });
  }
});
 
 
// Download file stored in user task variables
app.get('/download/:userTaskKey/:variableName', async (req, res) => {
  const { userTaskKey, variableName } = req.params;

  const token = await getAccessToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }
 
  try {
 
    // 🔹 POST to Camunda's variable search API
    const response = await axios.post(
      `http://localhost:8088/v2/user-tasks/${userTaskKey}/variables/search`,
      {
        filters: [
          {
            name: variableName
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
 
    const variables = response.data.items;
    if (!variables || variables.length === 0) {
      return res.status(404).json({ error: 'Variable not found' });
    }
 
    const variable = variables[0];
    const fileName = variable.name || 'downloaded_file';
    const mimeType = variable.mimeType || 'application/octet-stream';
    const value = variable.value;
 
    // 🔹 Handle binary/base64 file data
    const fileBuffer = Buffer.from(value, 'base64');
 
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`
    });
 
    res.send(fileBuffer);
  } catch (err) {
    console.error('❌ Error downloading variable:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to download variable from Camunda' });
  }
});
 
 
// ===== Start server =====
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));