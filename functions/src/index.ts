import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TextToSpeechLongAudioSynthesizeClient } from '@google-cloud/text-to-speech';

admin.initializeApp();

const ttsClient = new TextToSpeechLongAudioSynthesizeClient();

async function processTTS(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext,
  collectionName: string,
) {
  const after = change.after;
  const before = change.before;

  if (!after.exists) return;

  const afterStatus = after.get('ttsStatus');
  const beforeStatus = before.exists ? before.get('ttsStatus') : null;

  if (afterStatus !== 'PENDING' || beforeStatus === 'PENDING') {
    return;
  }

  const docId = context.params.docId as string;
  const docRef = admin.firestore().collection(collectionName).doc(docId);

  try {
    await docRef.update({ ttsStatus: 'PROCESSING', audioReady: false });

    const voiceText = (after.get('voiceText') as string) || (after.get('content') as string) || '';
    const languageCode = (after.get('ttsLanguageCode') as string) || 'cmn-CN';
    const voiceName = (after.get('ttsVoiceName') as string) || 'cmn-CN-Wavenet-A';

    if (!voiceText.trim()) {
      await docRef.update({
        ttsStatus: 'ERROR',
        audioReady: false,
        ttsErrorMessage: 'voiceText 为空，无法生成音频',
      });
      return;
    }

    // 获取项目信息
    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
    if (!projectId) {
      throw new Error('无法获取项目 ID');
    }

    // 获取 Storage bucket 名称
    const bucket = admin.storage().bucket();
    const bucketName = bucket.name;

    // 设置输出路径（Long Audio API 只支持 LINEAR16，输出为 WAV 格式）
    const storagePath = `tts/${collectionName}/${docId}.wav`;
    const outputGcsUri = `gs://${bucketName}/${storagePath}`;

    console.log(`开始 Long Audio TTS 处理: ${collectionName}/${docId}`);
    console.log(`输出路径: ${outputGcsUri}`);
    console.log(`文本长度: ${voiceText.length} 字符`);

    // 使用 Long Audio API（注意：目前只支持 LINEAR16 编码）
    const request = {
      parent: `projects/${projectId}/locations/us-central1`,
      input: { text: voiceText },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: 'LINEAR16' as const },
      outputGcsUri: outputGcsUri,
    };

    const [operation] = await ttsClient.synthesizeLongAudio(request);

    console.log(`Long Audio 操作已启动: ${operation.name}`);

    // 等待操作完成（最多 5 分钟）
    await operation.promise();

    console.log(`Long Audio 处理完成: ${collectionName}/${docId}`);

    await docRef.update({
      ttsStatus: 'READY',
      audioReady: true,
      audioStoragePath: storagePath,
      ttsErrorMessage: admin.firestore.FieldValue.delete(),
    });
  } catch (error: any) {
    console.error(`TTS 处理失败: ${collectionName}/${docId}`, error);
    await docRef.update({
      ttsStatus: 'ERROR',
      audioReady: false,
      ttsErrorMessage: error?.message || '未知错误',
    });
  }
}

export const processTTSBusiness = functions.firestore
  .document('business/{docId}')
  .onWrite((change, context) => processTTS(change, context, 'business'));

export const processTTSTechnology = functions.firestore
  .document('technology/{docId}')
  .onWrite((change, context) => processTTS(change, context, 'technology'));

export const processTTSSports = functions.firestore
  .document('sports/{docId}')
  .onWrite((change, context) => processTTS(change, context, 'sports'));

export const processTTSSecurity = functions.firestore
  .document('security/{docId}')
  .onWrite((change, context) => processTTS(change, context, 'security'));

