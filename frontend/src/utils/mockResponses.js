import { SCHEDULED_LANGUAGES } from '../constants/languages.js';

/**
 * Local mock response generator for Phase 1 frontend prototype.
 * NOTE: This is purely a local mock demonstration.
 * No actual AI/LLM model, backend, or RAG retrieval is connected in this phase.
 */
export const generateMockResponse = (userQuery, languageCode) => {
  const queryLower = userQuery.toLowerCase();
  const langObj = SCHEDULED_LANGUAGES.find((l) => l.code === languageCode) || {
    name: 'Hindi',
    nativeName: 'हिन्दी'
  };

  let category = 'General Assistance';
  let responseText = '';
  let mockSource = '';

  if (
    queryLower.includes('kisan') ||
    queryLower.includes('scheme') ||
    queryLower.includes('yojana') ||
    queryLower.includes('योजना') ||
    queryLower.includes('किसान') ||
    queryLower.includes('card') ||
    queryLower.includes('ration') ||
    queryLower.includes('राशन')
  ) {
    category = 'Government Schemes';
    mockSource = 'Ministry of Agriculture & Farmers Welfare / PM-Kisan Portal (Simulated Source)';
    responseText =
      `यह फेज़ 1 प्रोटोटाइप का एक नमूना उत्तर (Mock Response) है। वास्तविक प्रणाली में यह उत्तर ${langObj.name} (${langObj.nativeName}) भाषा में सत्यापित सरकारी दस्तावेज़ों के आधार पर दिया जाएगा।\n\n` +
      `[सिम्युलेटेड जानकारी]: पीएम किसान सम्मान निधि योजना के तहत पात्र किसानों को प्रति वर्ष ₹6,000 की वित्तीय सहायता तीन समान किस्तों (प्रत्येक ₹2,000) में प्रत्यक्ष बैंक खाते (DBT) में भेजी जाती है। ई-केवाईसी (e-KYC) और भूमि सत्यापन अनिवार्य है।`;
  } else if (
    queryLower.includes('crop') ||
    queryLower.includes('fasal') ||
    queryLower.includes('फसल') ||
    queryLower.includes('gehu') ||
    queryLower.includes('गेहूं') ||
    queryLower.includes('pest') ||
    queryLower.includes('कीट') ||
    queryLower.includes('kheti') ||
    queryLower.includes('खेती')
  ) {
    category = 'Agriculture & Crops';
    mockSource = 'ICAR / National Agriculture Advisory Portal (Simulated Source)';
    responseText =
      `यह फेज़ 1 प्रोटोटाइप का एक नमूना उत्तर (Mock Response) है। लक्षित भाषा: ${langObj.name} (${langObj.nativeName})।\n\n` +
      `[सिम्युलेटेड कृषि सलाह]: रबी और खरीफ फसलों में कीट नियंत्रण के लिए जैविक तरीकों और अनुशंसित जैव-कीटनाशकों को प्राथमिकता दें। आवश्यकता पड़ने पर स्थानीय कृषि विज्ञान केंद्र (KVK) या ग्राम सेवक से संपर्क करें।`;
  } else if (
    queryLower.includes('health') ||
    queryLower.includes('swasthya') ||
    queryLower.includes('स्वास्थ्य') ||
    queryLower.includes('doctor') ||
    queryLower.includes('दवा') ||
    queryLower.includes('asha') ||
    queryLower.includes('आशा') ||
    queryLower.includes('ayushman') ||
    queryLower.includes('आयुष्मान')
  ) {
    category = 'General Health Information';
    mockSource = 'Ministry of Health and Family Welfare (MoHFW) / Ayushman Bharat (Simulated Source)';
    responseText =
      `यह फेज़ 1 प्रोटोटाइप का एक नमूना उत्तर (Mock Response) है। लक्षित भाषा: ${langObj.name} (${langObj.nativeName})।\n\n` +
      `[सिम्युलेटेड स्वास्थ्य सूचना]: आयुष्मान भारत (PM-JAY) के तहत पात्र परिवारों को प्रति वर्ष ₹5 लाख तक का निःशुल्क द्वितीयक और तृतीयक उपचार सरकारी व सूचीबद्ध निजी अस्पतालों में मिलता है। आपातकालीन स्थिति में 108 या नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) पर संपर्क करें।`;
  } else {
    category = 'General Rural Assistance';
    mockSource = 'Rural Sahayak Knowledge Base (Simulated Prototype)';
    responseText =
      `यह फेज़ 1 का नमूना (Mock) उत्तर है। आपने पूछा: "${userQuery}"। (लक्षित भाषा: ${langObj.name} / ${langObj.nativeName})\n\n` +
      `फेज़ 2 में LangChain, FAISS और Qwen3 मॉडल को जोड़कर आपकी चुनी गई भाषा में सत्यापित RAG उत्तर प्रदान किया जाएगा।`;
  }

  return {
    id: 'mock-' + Date.now(),
    sender: 'assistant',
    isMock: true,
    category: category,
    source: mockSource,
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};
