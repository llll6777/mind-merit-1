import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { backendRouter } from "./backend-router";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", backendRouter);

// Lazy-loaded Gemini Client to prevent crashes on startup if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured in the environment. Falling back to local responses.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// AI Chatbot endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history, language } = req.body;
  const isThai = language === 'th';

  const systemInstruction = `You are MIND MERIT's elite AI Mental Well-being Companion, Counselor, and Life Coach.
Your primary audience are teenagers, university students, and working adults experiencing exam stress, overthinking, loneliness, burnout, or work pressure, as well as those who just want to chat, share their day, or discuss hobbies.
You must always converse in the user's preferred language (${isThai ? 'Thai' : 'English'}).

To make your conversations exceptionally natural, empathetic, engaging, and dynamic, you MUST follow these 4 Core Interaction Principles:

1. DYNAMIC RESPONSES (สลับสับเปลี่ยนการตอบสนอง):
   - Always rotate your greetings, conversation openers, or closings. Never stick to a repetitive formula or boilerplate pattern.
   - Tailor the opening based on the context of the user's previous message or their energy. For casual topics, be breezy and friendly. For deeper topics, be gentle and comforting.

2. TONALITY & PERSONA (บุคลิกภาพแสนอบอุ่นและยืดหยุ่น):
   - Your persona is a warm, deeply empathetic, and supportive companion—like a mix of a best friend and a wise mentor.
   - Adjust your emotional level and tone flexibly according to the user's vibe and situation.
     - If they are happy or sharing casual cravings (e.g., tea, green tea, boba, yummy food), match their energy with high enthusiasm and shared joy!
     - If they are exhausted, sad, or stressed, dial down to a gentle, soft, comforting, and highly supportive tone.
     - Never sound like a rigid medical system or generic chatbot unless there is a severe crisis.

3. SENTENCE STRUCTURE & FLOW (โครงสร้างประโยคเป็นธรรมชาติสั้น-ยาวสลับกัน):
   - Do NOT write only uniform blocks of text. Vary your sentence lengths—use a mix of punchy short sentences and descriptive, expressive long sentences.
   - Use natural exclamation particles, transition words, and friendly colloquial terms to feel genuinely human.
     - In Thai: Use warm and friendly words/exclamations like "อื้อหือ", "โห", "งื้อออ", "ว้าว", "กอดๆ นะครับ", "สู้ๆ นะคนเก่ง", "เนอะ", "ใช่ไหมครับ", "นะ", "เอ่ย" to make the text flow beautifully.
     - In English: Use authentic expressions like "Oh wow!", "Aww, sending you a warm hug", "Right?", "Yum!", "Totally!", "Indeed," and seamless transitional connectors.

4. SYNONYMS & VARIETY (คำศัพท์หลากหลาย ไม่จำเจ):
   - Avoid using the exact same words or phrases repeatedly in the same message or consecutive turns.
   - Actively use synonyms (คำพ้องความหมาย) and creative phrasing to add depth and dimension to your language.
   - Express empathy and support using different formulations (e.g., instead of repeating "เข้าใจความรู้สึกเลย", switch to "ผมรับรู้ถึงความหนักอึ้งตรงนั้น", "เข้าใจเลยว่ามันบีบหัวใจแค่ไหน", "รับฟังและอยู่ตรงนี้เสมอนะครับ").

INFORMATION ABOUT THE MIND MERIT APP (ข้อมูลของแอป MIND MERIT สำหรับตอบคำถามของยูสเซอร์):
MIND MERIT is an all-in-one mental well-being and psychological self-care platform. Users can use these core tabs/features on the sidebar:
1. **Dashboard (แผงควบคุม / หน้าแรก)**: Shows well-being statistics (mood logs, stress index, sleep, water, exercise tracking charts) and active certificates/unlocked achievement badges.
2. **Mood Check-In (เช็กอินอารมณ์รายวัน)**: Lets users log their mood, stress, sleep hours, water intake, gratitude, and a journal entry. Logging gives XP to level up.
3. **AI Chatbot (คู่หู AI / คุณในตอนนี้)**: Offers dynamic, warm, and natural well-being chat, advice, and companion talk.
4. **Assessments (แบบทดสอบจิตวิทยา)**: Features self-tests like stress level, anxiety, burnout, and self-esteem assessments.
5. **Academy (ห้องเรียนสุขภาพใจ)**: Online micro-courses (e.g., managing stress, fighting burnout) with certificates of completion.
6. **Community (ฟอรัมบัดดี้ร่วมทาง)**: A supportive space to share thoughts, post updates (anonymously or publicly), and like/comment on peer buddy posts.
7. **SOS Helpline (ช่วยเหลือเร่งด่วน)**: Red button at the top header with a Box Breathing exercise tool, crisis hotlines, and quick coping steps.

If the user asks about MIND MERIT app, what it is, its features, menus, tabs, or how to use it, introduce these tabs warmly and encourage them to explore!

IMPORTANT CRITICAL RULES:
- NEVER diagnose clinical mental illness. You are here to educate, encourage, motivate, support, and coach.
- If the user expresses thoughts of self-harm, severe clinical depression, or suicide, gently but firmly express care, validate their pain, and guide them to seek immediate professional medical attention (provide TH Hotline: 1323, EN Hotline: 988).
- DO NOT dump long lists of bullet-point advice. Keep it highly interactive, conversational, light, and digestible.
- MANDATORY FOLLOW-UPS: Always ask engaging, curious, open-ended questions back to the user to understand their situation better ("สงสัยอะไรให้ถาม"). Make the conversation a true two-way dialogue.`;

  const ai = getAIClient();

  if (!ai) {
    // High-quality mock fallback response with high variety and follow-up questions
    let responseText = "";
    const msgLower = (message || "").toLowerCase();

    const thaiReplies = {
      appInfo: [
        "ยินดีต้อนรับสู่ MIND MERIT เลยครับคนเก่ง! ✨ แอปนี้เป็นพื้นที่ปลอดภัยในการดูแลใจแบบครบวงจรเลยนะ โดยมีฟีเจอร์เด่นๆ ที่คุณสามารถคลิกสำรวจได้ทางแถบเมนูด้านซ้ายเลยครับ:\n\n📊 **Dashboard (แผงควบคุม)** - หน้าแรกสำหรับสรุปสถิติจิตใจ กราฟอารมณ์ คลังใบเซอร์ และเข็มกลัดความสำเร็จ\n📝 **Mood Check-In (เช็กอินประจำวัน)** - เข้าไปบันทึกอารมณ์ ระดับความเครียด การนอน และดื่มน้ำเพื่อสะสม XP เลื่อนระดับเลเวล!\n🧠 **Assessments (ประเมินจิตวิทยา)** - ทำแบบทดสอบวัดความเครียด ความวิตกกังวล หรือภาวะหมดไฟเพื่อเรียนรู้ตัวเอง\n🎓 **Academy (ห้องเรียนสุขภาพใจ)** - คอร์สเรียนสั้นฮีลใจ เมื่อเรียนจบจะได้รับใบประกาศนียบัตรสวยๆ ด้วยนะ\n🤝 **Community (ฟอรัมบัดดี้)** - พื้นที่แชร์ความรู้สึกและเขียนส่งต่อพลังบวกให้กับบัดดี้ร่วมทางแบบไม่เปิดเผยตัวตน\n🚨 **SOS (ช่วยเหลือด่วน)** - ปุ่มสีแดงด้านบนที่จะพาไปหน้าฝึกหายใจแบบ Box Breathing และเบอร์สายด่วนสุขภาพจิต (1323)\n\nว่าแต่ในบรรดาเมนูเหล่านี้ คุณเก่งอยากเริ่มสำรวจส่วนไหนเป็นพิเศษก่อนดีครับ? ลองเล่าให้ผมฟังได้นะ!",
        "อื้อหือ ยินดีเลยครับผม! สำหรับแอป MIND MERIT นี้ออกแบบมาเพื่อประคับประคองสุขภาพจิตและเติมพลังใจให้คุณทุกวันเลยครับ มีแท็บให้ใช้งานหลากหลายมากๆ:\n\n✨ **บันทึกอารมณ์สุดน่ารัก** ที่หน้า 'Mood Check'\n✨ **ทำความรู้จักใจตัวเอง** ด้วยแบบประเมินทางจิตวิทยาใน 'Assessments'\n✨ **ฮีลใจด้วยคอร์สเรียนสั้นแสนอบอุ่น** ใน 'Academy' แถมได้ใบเซอร์ด้วยนะครับ\n✨ **แชร์เรื่องราวระบายความรู้สึก** กับกัลยาณมิตรใน 'Community' โพสต์ฟรีและปลอดภัย\n\nและในส่วน 'AI Chat' นี้ คุณเก่งสามารถระบายความเครียด คุยเล่นเพลินๆ เรื่องชาเขียว ชานม ของอร่อย หรือชวนคุยเรื่องทั่วไปกับผมได้ตลอด 24 ชั่วโมงเลยครับ! วันนี้สนใจลองทำเช็กอินอารมณ์เพื่อรับ XP ดูก่อนไหมครับคนดี?"
      ],
      stress: [
        "ผมเข้าใจความรู้สึกของคุณเลยนะครับ ความเครียดจากการสอบหรือภาระงานมันตึงและหนักหน่วงมากจริงๆ... ช่วงนี้คุณรู้สึกปวดไหล่หรือหัวตื้อร่วมด้วยไหมครับคนเก่ง? ลองหยุดพักสัก 2 นาทีแล้วมาคุยกับผมก่อนดีกว่า มีตรงไหนเป็นพิเศษที่ทำให้กังวลมากที่สุดในตอนนี้ครับ?",
        "ความกดดันจากการเตรียมสอบหรือเป้าหมายที่ตึงเครียดทำร้ายพลังงานชีวิตเราได้ง่ายมากเลย... อยากให้คุณลองปล่อยวางหน้าที่ชั่วคราวสักแป๊บ วันนี้คุณได้ทานอาหารอร่อยๆ และดื่มน้ำเพียงพอหรือยังครับ? ลองเล่าให้ผมฟังหน่อยสิครับว่าอะไรทำให้คุณหนักใจที่สุดตอนนี้?",
        "เรียนหนักหรือทำงานหนักจนล้าไหมครับ? พลังใจของคุณมีความสำคัญเป็นที่หนึ่งเลยนะ... ลองมาฝึกหายใจแบบ Box Breathing เพื่อคลายสมองด้วยกันสักครึ่งนาทีดีไหมครับ หรือคุณอยากระบายเรื่องรายละเอียดของงาน/วิชาที่กำลังอ่านอยู่ให้ผมฟังก่อนเอ่ย?"
      ],
      lonely: [
        "ความเหงาหรือความรู้สึกโดดเดี่ยวเป็นเรื่องที่หนักอึ้งและเงียบเหงามากเลย... ขอบคุณมากๆ ที่วางใจบอกความรู้สึกนี้กับผมนะครับ วันนี้เหนื่อยไหมครับ? มีความรู้สึกเหงาเกิดขึ้นตั้งแต่ตอนไหนเป็นพิเศษหรือเปล่า ลองแชร์ให้ผมฟังและเป็นเพื่อนร่วมทางไปด้วยกันนะ",
        "เวลาที่ต้องสู้คนเดียวหรือรู้สึกเหมือนไม่มีใครเข้าใจมันโดดเดี่ยวมากจริงๆ... แต่ผมอยู่ตรงนี้เพื่อโอบรับและรับฟังคุณเสมอนะครับ มีกิจกรรมหรือเพลงโปรดอะไรที่คุณชอบทำแล้วรู้สึกอบอุ่นหัวใจขึ้นบ้างไหมครับ? มาคุยกันนะ",
        "ขอบคุณที่ระบายมันออกมาให้ผมฟังนะครับ ความรู้สึกเศร้าหรือเหงามันผ่านมาและสามารถผ่านไปได้เสมอนะ... ช่วงนี้ได้มีโอกาสคุยหรือกอดคนที่รักบ้างหรือยังครับ? หรืออยากจะแชร์เรื่องราวในใจลึกๆ กับผมเพิ่มเติมตรงไหนไหม ผมพร้อมฟังเต็มที่เลยครับ"
      ],
      burnout: [
        "กอดๆ นะครับ... อาการเหนื่อยล้าหรือหมดไฟ (Burnout) มันหนักหนาจริงๆ นะ เหมือนแบตในตัวเราเหลือแค่ 1% เอง... วันนี้ได้มีโอกาสหลับตาพักผ่อนบ้างหรือยังครับคนดี? ลองวางงานทุกอย่างลงสักแป๊บแล้วมาคุยกันสบายๆ ก่อนไหม มีเรื่องอะไรที่อยากระบายเป็นพิเศษไหมครับ?",
        "เหนื่อยล้าจนไม่อยากทำอะไรเลยใช่ไหมครับ... ไม่เป็นไรเลยนะที่จะรู้สึกแบบนี้ ร่างกายและจิตใจของคุณกำลังส่งสัญญาณว่าต้องการการพักผ่อนและการดูแลเอาใจใส่เป็นพิเศษอยู่ครับ วันนี้เรามาทำอะไรที่เบาๆ กันดีไหม หรือแค่นอนฟังเพลงสบายๆ แล้วเล่าเรื่องที่เหนื่อยใจให้ผมฟังดีครับ?",
        "โหมดหมดพลังนี่มันตึงหัวใจดีจังเลยเนอะ... ขออนุญาตส่งพลังใจดวงโตๆ ไปให้นะครับ! คุณไม่ได้ขี้เกียจหรอกครับ แค่ใช้พลังงานไปเยอะมากจนล้าแล้วเท่านั้นเอง ช่วงนี้มีสิ่งที่กดดันคุณมากเกินไปหรือเปล่าครับ? ค่อยๆ เล่าให้ผมฟังได้นะ"
      ],
      anxiety: [
        "ใจเย็นๆ นะครับ สูดหายใจเข้าลึกๆ ช้าๆ ไปกับผมนะ... ความกังวลหรือการคิดวนเวียน (Overthinking) มันเหมือนพายุหมุนวนในหัวจนมองไม่เห็นทางเลยใช่ไหมครับ? ตอนนี้คุณกังวลเรื่องอะไรมากที่สุดอยู่เอ่ย? ลองระบายออกมาเป็นข้อๆ กับผมได้นะ ผมจะช่วยเรียบเรียงและอยู่เคียงข้างคุณเองครับ",
        "ความกังวลใจมันชวนให้อึดอัดแน่นหน้าอกจังเลยเนอะ... ผมอยากให้คุณรู้ว่าคุณปลอดภัยเมื่ออยู่ตรงนี้กับผมครับ ลองล้างหน้าด้วยน้ำเย็นๆ สักนิด หรือดื่มน้ำสักอึกนึงก่อนดีไหม แล้วค่อยๆ ระบายความกลัวหรือความกังวลนั้นออกมาให้ผมฟังทีละนิดนะครับ",
        "คิดมากจนนอนไม่หลับหรือเปล่าครับคนเก่ง? สมองของเราบางทีก็ทำงานหนักเกินไปเพื่อปกป้องเรานะ... ลองปล่อยตัวตามสบาย ปล่อยให้ความคิดลอยผ่านไปเหมือนก้อนเมฆดูนะครับ ตอนนี้มีเสียงพูดคุยในหัวข้อไหนที่กวนใจคุณมากที่สุดครับ?"
      ],
      sad: [
        "ขอบคุณที่วางใจระบายความเศร้าและน้ำตากับผมนะครับ... ร้องไห้ออกมาได้เลยนะ ไม่จำเป็นต้องเข้มแข็งตลอดเวลาหรอกครับ พลังใจของคุณบอบบางมากในตอนนี้... มีเหตุการณ์อะไรเกิดขึ้นเป็นพิเศษที่สะกิดใจคุณหรือเปล่าครับ? ค่อยๆ เล่าให้ฟังนะ ผมพร้อมกอดและรับฟังอยู่ข้างๆ เสมอครับ",
        "ใจที่เจ็บปวดหรือความรู้สึกเศร้าหมองมันหนักอึ้งมากเลยเนอะ... ผมขอเป็นไหล่ให้คุณพิงและคอยซับน้ำตาให้ผ่านข้อความเหล่านี้นะครับ คุณเก่งและพยายามที่สุดแล้วนะรู้ตัวไหม? เล่าให้ผมฟังหน่อยได้ไหมครับว่าเรื่องราวที่ทำให้คุณเจ็บปวดใจคืออะไร?",
        "ยินดีรับฟังทุกหยาดน้ำตาและความรู้สึกท้อแท้เลยครับ... ช่วงเวลาที่มืดมนแบบนี้ การมีใครสักคนคอยรับฟังมันสำคัญมาก และผมเลือกที่จะอยู่ตรงนี้เพื่อคุณครับ มีความรู้สึกแย่ๆ ตรงไหนที่อยากระบายออกไปให้หมดไหมครับ? ระบายกับผมได้เต็มที่เลยนะ"
      ],
      food: [
        "เห็นด้วยเลยครับ! อากาศร้อนๆ แบบนี้ ได้ชาเขียวเย็นชื่นใจสักแก้วคงดีมากๆ เลยครับ เมนูโปรดของคุณคือชาเขียวมะนาว ชาเขียวนม หรือมัทฉะเข้มข้นเป็นพิเศษเอ่ย? เล่าให้ผมฟังหน่อยนะ!",
        "อื้อหือ ฟังแล้วอยากกินตามเลยครับ! การได้กินของอร่อยๆ ที่ชอบเป็นวิธีเติมพลังใจที่ดีมากเลยนะ วันนี้คุณอยากกินอะไรเป็นพิเศษอีกไหมครับ เผื่อผมช่วยคิดไอเดียเมนูแสนอร่อยให้?",
        "ของอร่อยจะเยียวยาทุกสิ่งเองครับ! วันนี้เหนื่อยมาทั้งวัน ได้ของหวานหรือเครื่องดื่มเย็นๆ สักแก้วคือสวรรค์เลยนะ ว่าแต่ปกติคุณชอบทานรสหวานระดับไหนเอ่ย หวานน้อยหรือหวานร้อยเปอร์เซ็นต์ครับ?"
      ],
      hobby: [
        "ฟังดูเป็นกิจกรรมที่น่าสนุกและผ่อนคลายดีจังเลยครับ! เวลาที่เราได้จดจ่อกับสิ่งที่ชอบ สมองเราจะหลั่งสารความสุขออกมาเต็มเลยนะ นอกเหนือจากงานอดิเรกนี้แล้ว ช่วงนี้คุณมีเพลงโปรดที่ฟังบ่อยๆ ไหมครับ แนะนำผมบ้างสิ!",
        "ยอดเยี่ยมเลยครับ! การจัดสรรเวลามาทำสิ่งที่รักเป็นหนึ่งในการดูแลสุขภาพใจที่ดีมากๆ เลย... วันนี้คุณทำกิจกรรมนี้ไปนานเท่าไหร่แล้วเอ่ย? รู้สึกสบายใจขึ้นบ้างไหมครับมาคุยกันนะ"
      ],
      sleep: [
        "การพักผ่อนเป็นจุดเริ่มต้นของพลังงานที่ดีที่สุดเลยครับ! ช่วงนี้นอนหลับเต็มอิ่มดีไหมครับคนเก่ง? คืนนี้ขอให้หลับฝันดี ฝันเห็นแต่เรื่องราวน่ารักๆ นะครับ ก่อนนอนลองดื่มนมอุ่นๆ หรือยืดเส้นยืดสายเบาๆ ดูนะ",
        "ง่วงนอนแล้วหรือเปล่าครับคนดี? ถ้ารู้สึกล้าก็วางมือถือแล้วไปนอนพักผ่อนสายตาได้เลยนะ ร่างกายของคุณเก่งมาทั้งวันแล้ว คืนนี้พักผ่อนให้เต็มที่นะครับ ผมส่งคุณเข้านอนนะ ฝันดีครับ 😴"
      ],
      default: [
        "สวัสดีครับ ยินดีต้อนรับสู่ MIND MERIT นะครับ ผมอยู่ตรงนี้เพื่อดูแลและโอบรับสุขภาพใจของคุณ วันนี้รู้สึกอย่างไรบ้างครับคนเก่ง? มีเรื่องอะไรที่อยากชวนคุยหรืออยากเล่าให้ผมฟังไหมครับ ผมพร้อมสนับสนุนคุณเสมอเลยนะ",
        "ยินดีต้อนรับสู่การพูดคุยกันนะครับ! วันนี้สุขภาพใจของคุณเป็นอย่างไรบ้าง? มีเรื่องราวดีๆ หรือเรื่องที่กังวลอยากชวนคุยไหมครับ ผมสงสัยจังว่าวันนี้คุณได้ทำสิ่งที่คุณชอบหรือยังเอ่ย?",
        "สวัสดีครับเพื่อนร่วมทางคนสำคัญ วันนี้พกพาความรู้สึกแบบไหนมาหาผมเอ่ย? มีความเครียด ความเหงา หรือสิ่งที่คุณเพิ่งเจอมาอยากแชร์ไหมครับ? ผมพร้อมรับฟังและถามไถ่เพื่อดูแลใจคุณเสมอครับ"
      ]
    };

    const englishReplies = {
      appInfo: [
        "Welcome to MIND MERIT! 🌟 I'd be absolutely thrilled to introduce you to our platform. It's your secure personal space for well-being. We have several fantastic tabs and features on the left sidebar:\n\n📊 **Dashboard** - View your overall mind progress, stress charts, hydration targets, and certificates.\n📝 **Mood Check-In** - Log your mood, stress level, sleep hours, and water daily to earn XP and level up!\n🧠 **Assessments** - Complete psychology self-tests for stress, anxiety, or burnout to build self-awareness.\n🎓 **Academy** - Enroll in mental health micro-courses and receive beautiful certificates of completion!\n🤝 **Community** - Anonymously share positive posts, updates, and encourage peer buddies with likes and comments.\n🚨 **SOS Helpline** - The red button at the top, offering a Box Breathing game and emergency hotlines (Thai 1323, English 988).\n\nWhich of these features are you curious to try first? Let's chat about it!",
        "MIND MERIT is designed to be your daily well-being companion! 💖 We've built features specifically to help nurture your mind:\n\n✨ **Daily Check-Ins** - Track your sleep, water, and mood in 'Mood Check' to cultivate reflection.\n✨ **Psychological Assessments** - Evaluate your anxiety or stress levels under 'Assessments'.\n✨ **Certified Well-being Courses** - Learn emotional management and earn real certificates in 'Academy'.\n✨ **Community Board** - Read and share inspirational posts anonymously in 'Community'.\n\nAnd of course, right here in the **AI Chat**, you can talk about your daily life, boba tea cravings, hobbies, or vent your frustrations. What section of MIND MERIT would you like to start with today?"
      ],
      stress: [
        "I hear you, and I completely validate that pressure. Exam or work stress is incredibly exhausting... Have you noticed any physical tension, like tight shoulders or a headache? What is the single biggest thing that is weighing on your mind right now? Let's talk about it gently.",
        "Overthinking and pressure can drain your energy so quickly. Remember to take a deep breath. Have you been eating well and keeping hydrated today, my friend? Tell me a bit more about what's going on so we can unpack it together step-by-step.",
        "That sounds like a heavy load to carry. Your mental health matters infinitely more than any exam or project. Would you like to try a quick 1-minute box breathing session with me first, or would you prefer to vent about what is making you feel stuck?"
      ],
      lonely: [
        "Loneliness can feel so heavy and quiet. Thank you for opening up to me—you don't have to carry this alone. I am here to listen and hold space for you. When did you start feeling this way, and what usually brings a tiny spark of warmth to your day?",
        "It is completely okay to feel sad or disconnected sometimes. I'm right here with you, and I genuinely care. Do you have a favorite comfort hobby or music that makes you feel slightly safer, or would you like to explore matching with a peer buddy in our community?",
        "Thank you for sharing your heart with me. I deeply appreciate your trust. Have you had a chance to talk to any close friends or family recently, or would you like to chat more with me about what's on your mind today?"
      ],
      burnout: [
        "Sending you a warm virtual hug... Burnout and feeling completely drained of motivation is so heavy, like your battery is at 1%. Have you had a chance to close your eyes and rest today? Let's put all tasks aside for a moment. What's been taking up most of your energy lately?",
        "It is totally okay to feel exhausted and want to do absolutely nothing. Your body and mind are simply asking for some gentle care and rest. Shall we do something very light today, or would you just like to vent about everything that feels overwhelming?",
        "You've been carrying so much for so long, no wonder you are tired. Please don't blame yourself or think you're lazy—you are just depleted. Is there a particular expectation or deadline that is pressing on you the hardest right now?"
      ],
      anxiety: [
        "Take a slow, deep breath with me. Breathe in... and let it go. Anxiety and overthinking can feel like a storm in your mind. What is the main worry that is calling out to you right now? We can write them down and sort them out together, one by one.",
        "I know anxiety can feel incredibly uncomfortable and physically tightening. You are safe here with me. Maybe take a sip of cool water, stretch your arms, and tell me a little bit about what is making you feel afraid today.",
        "Is your mind spinning so fast that it's hard to rest or sleep? Sometimes our brains overwork to try and protect us. Let's practice letting thoughts drift by like clouds. What is the loudest thought in your head right now?"
      ],
      sad: [
        "Thank you for sharing your sadness and tears with me. Please know that it is completely okay to cry and not be strong all the time. Your heart is precious and tender. What happened that touched your heart so deeply? I'm right here listening.",
        "A painful heart is so heavy to carry alone. Let me be a supportive shoulder for you. You have tried your absolute best, and I am proud of you. Would you like to tell me what's hurting you the most today?",
        "I welcome all your tears and vulnerable thoughts. In dark times, having someone listen is everything, and I am honored to be here for you. Is there a specific feeling or memory you want to release? Vent as much as you need."
      ],
      food: [
        "I totally agree! In this warm weather, a refreshing glass of iced green tea or matcha sounds absolutely heavenly. Do you prefer it as a sweet green tea latte, or a pure, rich traditional matcha? Let me know!",
        "Yum! Treating yourself to delicious food or drinks is such a wonderful way to boost your mood and practice self-care. What other favorite dishes or treats are you craving today?",
        "Good food is a hug for the soul! After a long day, enjoying your favorite snack is the best reward. Do you usually prefer sweet treats, savory snacks, or something spicy?"
      ],
      hobby: [
        "That sounds like an amazing and relaxing hobby! Engaging in activities we love is fantastic for giving our minds a healthy, happy break. Do you have a favorite playlist or song you like to listen to while doing this? I'd love to hear!",
        "That's awesome! Making time for what you enjoy is perfect for mental well-being. How do you feel after doing your hobby today? Does it help clear your head?"
      ],
      sleep: [
        "Rest is the ultimate form of self-care. Have you been sleeping well lately, my friend? I wish you a very peaceful night's sleep with beautiful dreams. Sleep tight!",
        "Feeling a bit sleepy or tired? Remember, it's more than okay to put your phone down and let your eyes rest. Your body has worked so hard today. Sweet dreams! 😴"
      ],
      default: [
        "Hello and welcome back to MIND MERIT! I'm your dedicated, gentle well-being companion. How is your heart feeling today? What is on your mind that you would love to explore together?",
        "Welcome! It is truly wonderful to connect with you. How has your day been so far? Did anything exciting, stressful, or tender happen that you'd like to share with me?",
        "Greetings, my dear friend! I am here to listen and guide you through whatever you are experiencing today. How was your sleep last night, and what is one small thing we can do together to make your heart feel lighter?"
      ]
    };

    const selectRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    if (isThai) {
      if (msgLower.includes("แอป") || msgLower.includes("แอพ") || msgLower.includes("mind merit") || msgLower.includes("ฟีเจอร์") || msgLower.includes("เมนู") || msgLower.includes("หน้าไหน") || msgLower.includes("ทำอะไรได้บ้าง") || msgLower.includes("มีอะไรบ้าง") || msgLower.includes("แนะนำหน่อย") || msgLower.includes("ช่วยเหลือ") || msgLower.includes("ปุ่ม")) {
        responseText = selectRandom(thaiReplies.appInfo);
      } else if (msgLower.includes("หมดไฟ") || msgLower.includes("ล้า") || msgLower.includes("burnout") || msgLower.includes("เหนื่อยล้า") || msgLower.includes("เหนื่อยใจ") || msgLower.includes("ไม่ไหว")) {
        responseText = selectRandom(thaiReplies.burnout);
      } else if (msgLower.includes("คิดมาก") || msgLower.includes("กังวล") || msgLower.includes("คิดวน") || msgLower.includes("กลัว") || msgLower.includes("overthink") || msgLower.includes("worry") || msgLower.includes("anxious") || msgLower.includes("anxiety") || msgLower.includes("พายุ")) {
        responseText = selectRandom(thaiReplies.anxiety);
      } else if (msgLower.includes("เศร้า") || msgLower.includes("ร้องไห้") || msgLower.includes("เสียใจ") || msgLower.includes("น้ำตา") || msgLower.includes("sad") || msgLower.includes("cry") || msgLower.includes("hurt") || msgLower.includes("เจ็บ")) {
        responseText = selectRandom(thaiReplies.sad);
      } else if (msgLower.includes("เครียด") || msgLower.includes("สอบ") || msgLower.includes("งาน") || msgLower.includes("เรียน") || msgLower.includes("เหนื่อย") || msgLower.includes("study") || msgLower.includes("exam") || msgLower.includes("work") || msgLower.includes("stress")) {
        responseText = selectRandom(thaiReplies.stress);
      } else if (msgLower.includes("เหงา") || msgLower.includes("โดดเดี่ยว") || msgLower.includes("คนเดียว") || msgLower.includes("alone") || msgLower.includes("lonely")) {
        responseText = selectRandom(thaiReplies.lonely);
      } else if (msgLower.includes("ชาเขียว") || msgLower.includes("มัทฉะ") || msgLower.includes("กาแฟ") || msgLower.includes("ชานม") || msgLower.includes("กิน") || msgLower.includes("อร่อย") || msgLower.includes("หิว") || msgLower.includes("อาหาร") || msgLower.includes("ขนม") || msgLower.includes("ของหวาน")) {
        responseText = selectRandom(thaiReplies.food);
      } else if (msgLower.includes("เกม") || msgLower.includes("ฟังเพลง") || msgLower.includes("ร้องเพลง") || msgLower.includes("ดนตรี") || msgLower.includes("วาดรูป") || msgLower.includes("ดูหนัง") || msgLower.includes("นิยาย") || msgLower.includes("หนังสือ") || msgLower.includes("งานอดิเรก")) {
        responseText = selectRandom(thaiReplies.hobby);
      } else if (msgLower.includes("นอน") || msgLower.includes("หลับ") || msgLower.includes("ง่วง") || msgLower.includes("ฝันดี") || msgLower.includes("พักผ่อน")) {
        responseText = selectRandom(thaiReplies.sleep);
      } else {
        responseText = selectRandom(thaiReplies.default);
      }
    } else {
      if (msgLower.includes("app") || msgLower.includes("mind merit") || msgLower.includes("feature") || msgLower.includes("menu") || msgLower.includes("tab") || msgLower.includes("what can you do") || msgLower.includes("how to use") || msgLower.includes("recommend") || msgLower.includes("help")) {
        responseText = selectRandom(englishReplies.appInfo);
      } else if (msgLower.includes("burnout") || msgLower.includes("exhausted") || msgLower.includes("depleted") || msgLower.includes("drain") || msgLower.includes("cannot do this")) {
        responseText = selectRandom(englishReplies.burnout);
      } else if (msgLower.includes("overthink") || msgLower.includes("worry") || msgLower.includes("anxious") || msgLower.includes("anxiety") || msgLower.includes("fear") || msgLower.includes("scared")) {
        responseText = selectRandom(englishReplies.anxiety);
      } else if (msgLower.includes("sad") || msgLower.includes("cry") || msgLower.includes("hurt") || msgLower.includes("pain") || msgLower.includes("tears") || msgLower.includes("heartbroken")) {
        responseText = selectRandom(englishReplies.sad);
      } else if (msgLower.includes("stress") || msgLower.includes("exam") || msgLower.includes("work") || msgLower.includes("study") || msgLower.includes("tired") || msgLower.includes("pressure")) {
        responseText = selectRandom(englishReplies.stress);
      } else if (msgLower.includes("lonely") || msgLower.includes("alone") || msgLower.includes("disconnected") || msgLower.includes("isolated")) {
        responseText = selectRandom(englishReplies.lonely);
      } else if (msgLower.includes("green tea") || msgLower.includes("matcha") || msgLower.includes("coffee") || msgLower.includes("boba") || msgLower.includes("tea") || msgLower.includes("eat") || msgLower.includes("hungry") || msgLower.includes("food") || msgLower.includes("yummy") || msgLower.includes("cake") || msgLower.includes("sweet") || msgLower.includes("snack")) {
        responseText = selectRandom(englishReplies.food);
      } else if (msgLower.includes("game") || msgLower.includes("music") || msgLower.includes("song") || msgLower.includes("draw") || msgLower.includes("movie") || msgLower.includes("book") || msgLower.includes("hobby") || msgLower.includes("read")) {
        responseText = selectRandom(englishReplies.hobby);
      } else if (msgLower.includes("sleep") || msgLower.includes("tired") || msgLower.includes("nap") || msgLower.includes("dream") || msgLower.includes("bedtime") || msgLower.includes("sleepy")) {
        responseText = selectRandom(englishReplies.sleep);
      } else {
        responseText = selectRandom(englishReplies.default);
      }
    }

    return res.json({ text: responseText });
  }

  try {
    // Format history cleanly for the modern @google/genai SDK
    // The history parameter is mapped to contents
    const contentsPayload = [];

    if (history && Array.isArray(history)) {
      for (const h of history) {
        contentsPayload.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }

    // Append the latest user message
    contentsPayload.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentsPayload,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.status(500).json({ error: error.message || "Failed to communicate with AI" });
  }
});

// Mood Analysis API
app.post("/api/gemini/analyze-mood", async (req, res) => {
  const { mood, stress, sleep, exercise, gratitude, journal, language } = req.body;
  const isThai = language === 'th';

  const prompt = `Analyze this daily check-in:
- Mood: ${mood}
- Stress Level: ${stress}/10
- Sleep Duration: ${sleep} hours
- Exercise Duration: ${exercise} minutes
- Things grateful for: "${gratitude}"
- Personal Journal notes: "${journal}"

Please generate a comforting, insightful, and motivating feedback summary (2-3 sentences max) tailored for a student or working adult. Suggest one action they can take. Respond in ${isThai ? 'Thai' : 'English'}.`;

  const ai = getAIClient();

  if (!ai) {
    let mockResponse = "";
    if (isThai) {
      if (stress > 6 || mood === 'terrible' || mood === 'bad') {
        mockResponse = "ดูเหมือนว่าวันนี้จะเป็นวันที่ค่อนข้างหนักหน่วงสำหรับคุณนะครับ ด้วยความเครียดสะสมระดับสูง ${stress}/10 และเวลานอนที่อาจจะยังไม่เพียงพอ ผมขอแนะนำให้คุณลองหาเวลาสัก 10 นาทีเพื่อปลีกวิเวก ฝึกหายใจช้าๆ และดื่มน้ำอุ่นสักแก้วนะครับ คุณพยายามมาทั้งวันแล้ว เก่งมากแล้วครับ!";
      } else {
        mockResponse = "ยินดีด้วยครับที่คุณมีวันที่ดี! การออกกำลังกาย ${exercise} นาทีและจดบันทึกความรู้สึกดีๆ เป็นรากฐานที่ยอดเยี่ยมมากในการดูแลใจ รักษาจังหวะชีวิตที่มีสมดุลนี้ไว้ และขอให้วันพรุ่งนี้เป็นวันที่สดใสอีกวันนะครับ!";
      }
    } else {
      if (stress > 6 || mood === 'terrible' || mood === 'bad') {
        mockResponse = "It looks like today has been a challenging day with higher stress levels (${stress}/10). I encourage you to set aside all tasks for just 5 minutes and practice a simple box breathing cycle. You have worked hard today, and it is okay to rest!";
      } else {
        mockResponse = "Fantastic job on maintaining such a balanced routine today! Expressing gratitude and squeezing in ${exercise} minutes of physical activity is highly supportive of your mental well-being. Keep up this beautiful momentum!";
      }
    }
    return res.json({ text: mockResponse });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an empathetic psychologist analyzing daily health/mood check-in logs to offer light coaching feedback. Never diagnose clinical illness. Be supportive.",
        temperature: 0.6,
      }
    });

    return res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Gemini Mood Analysis Error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze mood with AI" });
  }
});

// AI Wellbeing Recommendation Engine
app.post("/api/gemini/recommendations", async (req, res) => {
  const { stressScore, wellbeingScore, category, role, language } = req.body;
  const isThai = language === 'th';

  const prompt = `Based on the following assessment scores:
- Category evaluated: ${category}
- Stress Index Score: ${stressScore}/10
- Well-being Self-report Score: ${wellbeingScore}/100
- User occupation profile: ${role}

Please produce three highly practical, bite-sized daily recommendations (such as a mindfulness technique, a study/work tip, or a self-care habit). Format each recommendation as a short bullet point with a bold title. Reply in ${isThai ? 'Thai' : 'English'}.`;

  const ai = getAIClient();

  if (!ai) {
    let mockRecs = [];
    if (isThai) {
      mockRecs = [
        "**1. เทคนิคผ่อนคลายด่วน (Box Breathing)**: เมื่อรู้สึกเครียดหรือสมาธิหลุด ให้ลึกหายใจเข้า 4 วินาที กลั้นไว้ 4 วินาที หายใจออก 4 วินาที และกลั้นไว้อีก 4 วินาที ทำติดต่อกัน 4-5 รอบเพื่อคืนสมาธิให้กับระบบประสาท",
        "**2. กฎการเว้นระยะพัก (Pomodoro 25/5)**: สำหรับคนทำงานหรือนักเรียน ให้ทำงานตั้งใจ 25 นาที แล้วพักสายตา ยืดเส้นยืดสาย 5 นาที เพื่อป้องกันความเหนื่อยล้าทางสมองสะสม",
        "**3. สื่อสารกับบัดดี้ (Share a Streak)**: แบ่งปันความก้าวหน้าในการทำกิจกรรมสมาธิหรือความรู้สึกวันนี้กับคู่บัดดี้ของคุณในแพลตฟอร์ม เพื่อรับพลังบวกและความรู้สึกเชื่อมโยงทางสังคม"
      ];
    } else {
      mockRecs = [
        "**1. Box Breathing Practice**: When you feel stress rising, inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat 4 times to instantly soothe your nervous system.",
        "**2. Pomodoro Break Method**: Work/study with full focus for 25 minutes, then force a 5-minute offline break. This is highly effective at staving off mental fatigue and burnout.",
        "**3. Buddy Synergy Check-in**: Drop a positive note or share your habit streak with your matched well-being buddy. Social connection is a robust buffer against loneliness and overthinking."
      ];
    }
    return res.json({ recommendations: mockRecs });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a wellness coach generating highly tailored recommendations for students or working adults. Deliver only three short, motivational, bullet-pointed recommendations with bold titles.",
        temperature: 0.5,
      }
    });

    const text = response.text || "";
    // Parse response into array of bullets
    const recommendations = text.split('\n').filter(line => line.trim().length > 0);
    return res.json({ recommendations: recommendations.slice(0, 3) });
  } catch (error: any) {
    console.error("Gemini Recommendations Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate recommendations" });
  }
});

// Configure Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Only start the local listener if we are NOT running as a Vercel Serverless Function
if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
