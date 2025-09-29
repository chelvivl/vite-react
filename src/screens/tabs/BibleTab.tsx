import BibleTopBar from '../../components/BibleTopBar'; // ← подключи TopBar
import { useState } from 'react';
import { ALL_BOOKS } from '../../utils/bibleData';


export default function BibleTab() {

  const [selectedBookKey, setSelectedBookKey] = useState<keyof typeof ALL_BOOKS>('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);

  return (
    <div style={{overflow: 'hidden'}}>
      <BibleTopBar
                title="Чтение Библии"
                selectedBookKey={selectedBookKey}
                selectedChapter={selectedChapter}
                onBookChange={setSelectedBookKey}
                onChapterChange={setSelectedChapter}
              />

      <div style={{minHeight: '100dvh', backgroundColor: '#F6F6F6'}}></div>
  </div>
  );
}