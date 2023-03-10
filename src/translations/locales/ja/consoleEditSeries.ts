import topNav from './commons/topNav';
import common from './commons/common';
import imageUploader from './commons/imageUploader';
import genres from './commons/genres';
import tagForm from './commons/tagForm';

const consoleEditSeries = {
  ...genres,
  ...common,
  ...topNav,
  ...imageUploader,
  ...tagForm,
  LABEL_SERIES: 'シリーズ',
  LABEL_CHAPTER: '章',
  LABEL_EDIT: '編集',
  LABEL_EDIT_SERIES: 'シリーズを編集',
  LABEL_UPDATE: 'アップデート',
  // FORM VALIDATION
  FORM_VALIDATION_DESCRIPTION_MAX:
    'シリーズの説明のタイトルは 2500 文字以内にする必要があります',
  FORM_VALIDATION_DESCRIPTION_REQUIRED: 'シリーズの説明が必要です',
  FORM_VALIDATION_GENRE_REQUIRED: 'ジャンル必須',
  FORM_VALIDATION_GENRE_MAX: 'ジャンル フィールドには 3 つ以下の項目が必要です',
  FORM_VALIDATION_LANGUAGE_ID_REQUIRED: '言語が必要です',
  FORM_VALIDATION_STATUS_REQUIRED: 'シリーズステータス必須',
  FORM_VALIDATION_TITLE_MAX: 'シリーズのタイトルは 100 文字以内にしてください',
  FORM_VALIDATION_TITLE_MATCHES:
    '文字 (a ～ z)、数字 (0 ～ 9)、特殊文字 (\':?"!-_&()<>.,+=@#$%|) のみを使用できます。',
  FORM_VALIDATION_TITLE_REQUIRED: 'シリーズタイトル必須',
  FORM_VALIDATION_COVER_REQUIRED: '表紙画像必須！',
  FORM_VALIDATION_BANNER_REQUIRED: 'バナー画像必須！',
  // END FORM VALIDATION
  LABEL_SINGLE_BANNER_DROPBOX:
    'ここにバナーをドロップするか、クリックして参照してください',
  LABEL_SINGLE_COVER_DROPBOX:
    'カバー写真をここにドロップするか、クリックして参照してください',
  LABEL_SINGLE_BANNER_SUB:
    'すべてのデバイスで最適な結果を得るには、1080 x 360 ピクセル以上の画像を使用してください',
  LABEL_SINGLE_COVER_SUB:
    'すべてのデバイスで最適な結果を得るには、600 x 400 ピクセル以上の画像を使用してください',
  LABEL_SERIES_TITLE: 'シリーズタイトル',
  LABEL_LANGUAGE: '言語',
  LABEL_PRIMARY_GENRE: '主なジャンル',
  LABEL_SECONDARY_GENRE: '二次ジャンル',
  LABEL_SERIES_STATUS: 'シリーズのステータス',
  LABEL_STATUS_ONGOING: '進行中',
  LABEL_STATUS_COMPLETED: '完了',
  LABEL_SERIES_DESCRIPTION: 'シリーズ説明',
  LABEL_PUBLISH_CHAPTER: 'チャプターを公開',
  LABEL_CHAPTER_TITLE: '章のタイトル',
  LABEL_CHAPTER_DESCRIPTION: '章の説明',
  LABEL_CHAPTER_NOTE_OPTIONAL: '章のメモ (オプション)',
  LABEL_NOTE_TEXTAREA_MSG_BOTTOM: 'この注記は、章の最後に表示されます',
  LABEL_NOT_FOUND_HEADER: '編集するこのシリーズが見つかりませんでした',
  LABEL_NOT_FOUND_MSG_1:
    'このエピコ シリーズが存在すると思われる場合は、指定されたシリーズ ID を添えてサポートにご連絡ください。',
  LABEL_NOT_FOUND_MSG_2: 'の言語 ID を持つ',
  LABEL_MAX_GENRES: 'ジャンルは3つまで選べます',
  LABEL_OPTIONAL_TAG_ERROR_MESSAGE: 'は予約語です。使用できません。',
  LABEL_ALLOW_FOR_TRANSLATION: 'クラウドソース翻訳を許可する',
};

export default consoleEditSeries;
