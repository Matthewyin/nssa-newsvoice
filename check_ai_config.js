const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./nssa-newsvoice-firebase-adminsdk-rvqxe-e8e8e8e8e8.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkConfig() {
  try {
    console.log('正在检查 AI 配置...\n');
    
    const aiModelDoc = await db.collection('config').doc('ai_model').get();
    
    if (!aiModelDoc.exists) {
      console.log('❌ AI 配置不存在！');
      return;
    }
    
    const config = aiModelDoc.data();
    
    console.log('✅ AI 配置：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`模型名称: ${config.modelName}`);
    console.log(`API 密钥: ${config.apiKey ? config.apiKey.substring(0, 20) + '...' : '未设置'}`);
    console.log(`超时时间: ${config.timeout} 毫秒 (${config.timeout / 1000} 秒)`);
    console.log(`提供商: ${config.provider}`);
    console.log('\n参数：');
    console.log(`  - Temperature: ${config.parameters?.temperature}`);
    console.log(`  - Max Tokens: ${config.parameters?.maxTokens}`);
    console.log(`  - Top P: ${config.parameters?.topP}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // 检查超时时间
    if (config.timeout < 900000) {
      console.log('⚠️  警告：超时时间小于 15 分钟 (900000 毫秒)');
      console.log(`   当前值：${config.timeout} 毫秒 (${config.timeout / 1000} 秒)`);
      console.log('   建议值：900000 毫秒 (15 分钟)\n');
    }
    
    // 检查模型名称
    const validModels = [
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
      'gemini-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];
    
    if (!validModels.includes(config.modelName)) {
      console.log(`⚠️  警告：模型名称 "${config.modelName}" 可能不是有效的免费模型`);
      console.log('   推荐的免费模型：');
      validModels.forEach(model => console.log(`   - ${model}`));
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

checkConfig();

