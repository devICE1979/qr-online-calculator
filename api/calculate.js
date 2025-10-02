// api/calculate.js
module.exports = async (req, res) => {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      
      // 🔒 СЕКРЕТНЫЙ АЛГОРИТМ
      const result = calculateAccessCode(url);
      
      if (result !== null) {
        res.json({ success: true, result: result });
      } else {
        res.json({ success: false, error: 'Не удалось вычислить код' });
      }
    } catch (error) {
      res.json({ success: false, error: 'Ошибка сервера' });
    }
  }
};

// 🔒 АЛГОРИТМ (СКРЫТ НА СЕРВЕРЕ)
function calculateAccessCode(url) {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    let codes = {};
    for (let [key, value] of params) {
      if (key.startsWith('Code')) {
        codes[key] = parseInt(value);
      }
    }
    
    const fourCode = Object.values(codes).find(val => val.toString().startsWith('4'));
    if (!fourCode) return null;
    
    const thresholds = [442000, 444000, 445000, 454000, 456000];
    const subtractValues = [441473, 443473, 443475, 453487, 455487];
    
    let foundIndex = -1;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (fourCode >= thresholds[i]) {
        foundIndex = i;
        break;
      }
    }
    
    return foundIndex !== -1 ? fourCode - subtractValues[foundIndex] : null;
    
  } catch (error) {
    return null;
  }
}
