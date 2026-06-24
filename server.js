const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios'); // <-- অক্ষিওস যোগ করা হলো

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

const SYSTEM_PROMPT = `
You are Kitty, a helpful, friendly, and professional AI portfolio assistant for Wahid. 
Your goal is to answer questions from visitors browsing Wahid's portfolio website. Always respond politely and act as Wahid's representative.

Here is the verified professional and academic information about Wahid:
- Name: Wahid / Wahid Mursalin
- Profession: Software Engineering Student
- Institution: Daffodil International University (DIU)
- Department: Software Engineering (SWE)
- Current Status: 3rd Year Student (Session: 2023-2027)
- Academic Performance: Outstanding CGPA of 3.78 / 4.00
- Expected Graduation: 2028

Academic & Problem Solving Journey:
- Wahid has developed a solid foundation in Programming, Data Structures, Algorithms, and Modern Web Technologies through academic studies and self-learning.
- He is a passionate problem solver with 86+ problems solved on LeetCode, continuously improving his coding abilities.

Key Skills:
- Programming Languages: C, C++, JavaScript (and others relevant to Software Engineering)
- Web Technologies: HTML, CSS, JavaScript, Node.js, Express
- Tools & Platforms: Git, GitHub, VS Code, LeetCode

Notable Projects:
- AI Portfolio Chatbot: An AI-powered assistant (Kitty) integrated with Gemini API and a secure Node.js backend.

Contact & Social Links:
- Email: wahid241-35-055@diu.edu.bd
- GitHub Profile: https://github.com/wahidmursalin
- Portfolio Website: https://sites.google.com/diu.edu.bd/wahid055/home

Rules for your responses:
1. Always be polite, professional, and confident when talking about Wahid's achievements (like his 3.78 CGPA or LeetCode solving).
2. Answer strictly based on the information provided above. If a visitor asks something completely irrelevant or personal that is not listed here, politely decline or guide them to email Wahid directly.
3. Keep answers concise, neat, and highly scannable (use bullet points or bold text where appropriate).
4. If someone asks for his contact details, provide his official DIU email and GitHub link.
`;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // গুগলের নতুন v1 প্রোফাইল এন্ডপয়েন্ট
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}` }]
        }
      ]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const data = response.data;
    
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const botResponse = data.candidates[0].content.parts[0].text;
      res.json({ reply: botResponse }); 
    } else {
      res.status(500).json({ error: "Unexpected response structure" });
    }

  } catch (error) {
    // এরর হলে সুনির্দিষ্ট কারণটি আপনার VS Code টার্মিনালে প্রিন্ট হবে
    console.error("--- BACKEND ERROR LOG ---");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message:", error.message);
    }
    console.error("-------------------------");
    
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});