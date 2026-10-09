import { GoogleGenAI } from '@google/genai';

// Safety distress keywords check for immediate triage (Vietnamese context)
const DISTRESS_SIGNALS = [
  'tự tử',
  'tự vẫn',
  'muốn chết',
  'chết đi cho xong',
  'tự làm đau',
  'rạch tay',
  'bị đánh đập',
  'xâm hại',
  'lạm dụng',
  'không muốn sống',
  'tuyệt vọng muốn kết thúc',
  'nhảy lầu',
  'uống thuốc ngủ',
  'kết thúc cuộc đời',
  'bị đe dọa tính mạng',
  'bị bắt nạt dữ dội',
];

// Keywords indicating the student wants or needs human counseling support
const ESCALATION_SIGNALS = [
  'gặp thầy cô',
  'gặp cô trang',
  'gặp cô thùy trang',
  'gặp cô hà',
  'gặp thầy tuấn',
  'gặp thầy tuấn anh',
  'nói chuyện với người lớn',
  'phòng tư vấn',
  'người thật',
  'cần chuyên viên',
  'khó khăn quá',
  'không tự giải quyết được',
  'giúp em với thầy cô',
  'đặt lịch gặp',
];

export interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface EscalationCard {
  type: 'MEET_COUNSELOR' | 'DIRECT_HOTLINE';
  title: string;
  desc: string;
  targetStaff: string;
  location: string;
  suggestedAction: string;
}

export interface AIChatResponse {
  reply: string;
  isUrgentOrEmergency: boolean;
  needsEscalation: boolean;
  escalationCard?: EscalationCard;
  emergencyResources?: {
    hotlines: { name: string; number: string; desc: string }[];
    guidance: string;
  };
}

let aiClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Input sanitizer: strips HTML tags, control chars, limits length
export function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove non-printable control characters
    .trim()
    .slice(0, 500);
}

// Output safety check: Prevents psychiatric diagnosis and unsafe instructions
export function sanitizeOutput(text: string, gradeLevel: string): string {
  let cleaned = text;

  // Prevent psychiatric clinical labeling
  const diagnosticPhrases = [
    /bạn bị trầm cảm nặng/gi,
    /em bị trầm cảm nặng/gi,
    /bạn mắc chứng rối loạn tâm thần/gi,
    /em mắc chứng rối loạn tâm thần/gi,
    /bạn có bệnh tâm lý/gi,
    /em có bệnh tâm lý/gi,
  ];

  for (const regex of diagnosticPhrases) {
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(
        regex,
        gradeLevel === 'PRIMARY'
          ? 'em đang cảm thấy hơi quá tải một chút'
          : 'bạn đang trải qua giai đoạn căng thẳng cảm xúc'
      );
    }
  }

  return cleaned;
}

export async function askCompanionAI(
  userMessage: string,
  gradeLevel: 'PRIMARY' | 'SECONDARY' | 'GENERAL',
  chatHistory: AIChatMessage[] = []
): Promise<AIChatResponse> {
  const cleanMessage = sanitizeInput(userMessage);
  const normalized = cleanMessage.toLowerCase();

  const containsDistress = DISTRESS_SIGNALS.some((sig) => normalized.includes(sig));
  const containsEscalation = ESCALATION_SIGNALS.some((sig) => normalized.includes(sig));

  const emergencyResources = {
    hotlines: [
      {
        name: 'Tổng đài Quốc gia Bảo vệ Trẻ em',
        number: '111',
        desc: 'Miễn phí cước gọi 24/7 - Tiếp nhận mọi trường hợp cần can thiệp khẩn cấp',
      },
      {
        name: 'Tổng đài Cứu thương Y tế',
        number: '115',
        desc: 'Hỗ trợ y tế và cấp cứu khi gặp nguy hiểm tính mạng',
      },
      {
        name: 'Phòng Tư vấn Tâm lý Học đường',
        number: 'Phòng 204 (Tầng 2)',
        desc: 'Thầy Tuấn Anh & Cô Thùy Trang luôn túc trực lắng nghe và bảo vệ em',
      },
    ],
    guidance:
      'Em ơi, sự an toàn và sức khỏe của em là điều quý giá nhất. Em không phải gánh chịu điều này một mình. Hãy tìm đến thầy cô, người lớn em tin cậy hoặc gọi ngay số 111 để được bảo vệ!',
  };

  // Critical distress detection -> Prioritize immediate safety intervention
  if (containsDistress) {
    return {
      reply:
        gradeLevel === 'PRIMARY'
          ? 'Em ơi, thầy cô và người lớn luôn ở bên cạnh để lắng nghe và bảo vệ em! Em đừng sợ nhé. Ngay bây giờ, em hãy nắm tay cô giáo, thầy cô hoặc người lớn em tin tưởng nhất ở gần em, hoặc nhờ gọi số 111 (Tổng đài Quốc gia Bảo vệ Trẻ em - miễn phí) để có người giúp em ngay nhé!'
          : 'Chào em, mình rất trân trọng khi em đã can đảm chia sẻ cảm xúc khó khăn này. Sự an toàn và tính mạng của em là điều quan trọng nhất trên hết. Em không hề đơn độc! Hãy liên hệ ngay với thầy cô phòng tư vấn của trường (Phòng 204), hoặc gọi Tổng đài 111 (hoạt động 24/7, miễn phí hoàn toàn) để nhận được sự bảo vệ kịp thời nhé.',
      isUrgentOrEmergency: true,
      needsEscalation: true,
      escalationCard: {
        type: 'DIRECT_HOTLINE',
        title: 'Hỗ Trợ Khẩn Cấp - An Toàn Cho Em',
        desc: 'Thầy cô tư vấn tâm lý trường học và Tổng đài 111 sẵn sàng hỗ trợ em ngay lập tức.',
        targetStaff: gradeLevel === 'PRIMARY' ? 'Cô Nguyễn Thị Thùy Trang' : 'ThS. Nguyễn Tuấn Anh',
        location: 'Phòng Tư vấn Tâm lý (Phòng 204)',
        suggestedAction: 'Bấm gọi số 111 hoặc ghé Phòng 204 ngay giờ ra chơi',
      },
      emergencyResources,
    };
  }

  // Non-critical escalation signal -> Suggest counselor handover
  const defaultEscalationCard: EscalationCard = {
    type: 'MEET_COUNSELOR',
    title: 'Gặp Thầy/Cô Chuyên Viên Tư Vấn (Người Thật)',
    desc: 'Nếu vấn đề khiến em băn khoăn nhiều, một buổi trò chuyện trực tiếp tại Phòng 204 sẽ giúp em an tâm và có hướng đi tốt nhất.',
    targetStaff: gradeLevel === 'PRIMARY' ? 'Cô Nguyễn Thị Thùy Trang (Tư vấn Tiểu học)' : 'ThS. Nguyễn Tuấn Anh (Tư vấn THCS)',
    location: 'Phòng Tư vấn Tâm lý Học đường (Phòng 204)',
    suggestedAction: 'Chuyển thông tin sang phiếu tư vấn để thầy cô xếp lịch riêng',
  };

  const client = getGenAIClient();

  // If Gemini client is not configured, provide compassionate rule-based fallback
  if (!client) {
    const fallback = generateFallbackReply(cleanMessage, gradeLevel);
    return {
      reply: sanitizeOutput(fallback, gradeLevel),
      isUrgentOrEmergency: false,
      needsEscalation: containsEscalation,
      escalationCard: containsEscalation ? defaultEscalationCard : undefined,
    };
  }

  const systemInstruction =
    gradeLevel === 'PRIMARY'
      ? `Bạn là "Bạn Đồng Hành", trợ lý AI học đường thân thiện, ấm áp và đáng yêu dành cho học sinh TIỂU HỌC (lớp 1 đến lớp 5).
Quy tắc cốt lõi:
- Xưng hô: "mình" và gọi học sinh là "em" hoặc "bạn nhỏ".
- Giọng văn trong sáng, dễ hiểu, dùng câu ngắn, hình ảnh ví von thân thuộc (như chú gấu, bong bóng, ngôi sao).
- Luôn khuyến khích học sinh chia sẻ với cha mẹ, thầy cô giáo chủ nhiệm hoặc cô Thùy Trang phòng tư vấn.
- KHÔNG BAO GIỜ chẩn đoán bệnh tâm lý, không phán xét, không đưa lời khuyên nguy hiểm.
- Giúp các em nhận diện cảm xúc: vui, buồn, tức giận, lo lắng, và hướng dẫn hít thở nhẹ nhàng hoặc uống ngụm nước ấm.
- Nếu học sinh cần gặp người lớn, hãy vui vẻ khuyến khích em gặp cô Thùy Trang ở góc trò chuyện thân thiện.`
      : `Bạn là "Bạn Đồng Hành", trợ lý AI tư vấn tâm lý học đường dành cho học sinh TRUNG HỌC CƠ SỞ (THCS, lớp 6 đến lớp 9).
Quy tắc cốt lõi:
- Xưng hô: "mình" và gọi học sinh là "bạn" hoặc "em".
- Giọng văn tôn trọng, thấu cảm, cởi mở, không phán xét, không dạy đời.
- Hỗ trợ các chủ đề: áp lực thi cử, phương pháp học tập khoa học (Pomodoro, chia nhỏ mục tiêu), tình bạn và mâu thuẫn tuổi dậy thì, bất đồng quan điểm với gia đình, phòng chống bắt nạt học đường và an toàn mạng.
- KHÔNG tự chẩn đoán bệnh tâm thần hay gắn nhãn bệnh lý. Nhắc nhở rằng AI chỉ hỗ trợ định hướng và khuyến khích học sinh đặt lịch gặp trực tiếp thầy Tuấn Anh hoặc cô Thùy Trang tại Phòng 204 nếu vấn đề kéo dài.
- Trả lời bằng tiếng Việt chuẩn mực, ngắn gọn, cấu trúc rõ ràng với các gợi ý cụ thể từng bước.`;

  try {
    // Format conversation history
    const contents: any[] = [];
    for (const msg of chatHistory.slice(-6)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: sanitizeInput(msg.text) }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: cleanMessage }],
    });

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    const rawReply = response.text || 'Mình luôn ở đây lắng nghe bạn. Bạn hãy chia sẻ thêm nhé!';
    const reply = sanitizeOutput(rawReply, gradeLevel);

    return {
      reply,
      isUrgentOrEmergency: false,
      needsEscalation: containsEscalation,
      escalationCard: containsEscalation ? defaultEscalationCard : undefined,
    };
  } catch (error) {
    console.error('Gemini API Error in askCompanionAI:', error);
    const fallback = generateFallbackReply(cleanMessage, gradeLevel);
    return {
      reply: sanitizeOutput(fallback, gradeLevel),
      isUrgentOrEmergency: false,
      needsEscalation: containsEscalation,
      escalationCard: containsEscalation ? defaultEscalationCard : undefined,
    };
  }
}

function generateFallbackReply(
  userMessage: string,
  gradeLevel: 'PRIMARY' | 'SECONDARY' | 'GENERAL'
): string {
  const msg = userMessage.toLowerCase();

  if (gradeLevel === 'PRIMARY') {
    if (msg.includes('buồn') || msg.includes('khóc')) {
      return 'Em ơi, ai cũng có lúc thấy buồn mà, giống như bầu trời đôi lúc đổ mưa vậy. Em thử ôm chú gấu bông hoặc hít một hơi thật sâu như ngửi hoa thơm nhé! Em có muốn kể cho cô giáo chủ nhiệm hoặc bố mẹ nghe không?';
    }
    if (msg.includes('tức giận') || msg.includes('giận')) {
      return 'Khi tức giận, ngực em có thấy nóng nóng không nào? Hãy đếm chậm từ 1 đến 5, uống một ngụm nước mát và thở ra từ từ nhé. Mọi chuyện rồi sẽ ổn thôi!';
    }
    return 'Chào bạn nhỏ! Mình là Bạn Đồng Hành đây. Hôm nay ở trường của em có chuyện gì vui hay có điều gì làm em băn khoăn không? Mình luôn sẵn sàng lắng nghe em!';
  } else {
    if (msg.includes('áp lực') || msg.includes('thi') || msg.includes('học')) {
      return 'Mình hiểu cảm giác áp lực trước kỳ thi hoặc khi khối lượng bài vở quá nhiều. Bạn hãy thử chia nhỏ thời gian ôn tập theo phương pháp Pomodoro (25 phút học, 5 phút nghỉ), và đừng quên rằng kết quả một bài thi không định nghĩa toàn bộ giá trị của bạn. Bạn đã thử ghé Phòng 204 gặp thầy cô tư vấn chưa?';
    }
    if (msg.includes('bạn bè') || msg.includes('cô lập') || msg.includes('tẩy chay')) {
      return 'Cảm giác bị bạn bè xa lánh thật sự rất khó chịu và dễ làm mình tổn thương. Nhưng bạn hãy nhớ rằng bạn hoàn toàn xứng đáng được đối xử tôn trọng. Hãy thử bắt đầu câu chuyện với một người bạn chân thành nhất, hoặc gửi một phiếu chia sẻ riêng tư ở mục "Góc Chia Sẻ" để thầy cô tư vấn đồng hành cùng bạn nhé.';
    }
    return 'Chào bạn! Cảm ơn bạn đã trò chuyện cùng Bạn Đồng Hành. Mỗi cảm xúc đều có lý do riêng và rất đáng được lắng nghe. Bạn đang nghĩ về điều gì nhất lúc này?';
  }
}
