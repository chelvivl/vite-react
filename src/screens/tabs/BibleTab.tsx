import BibleTopBar from '../../components/BibleTopBar'; // ← подключи TopBar
import { useState } from 'react';
import bibleData from '../../data/rst.json';
import { ALL_BOOKS } from '../../utils/bibleData';
import { useEffect } from 'react';
import { BibleData, Verse } from '../../types/bible';

const typedBibleData = bibleData as BibleData;

export default function BibleTab() {

  const [selectedBookKey, setSelectedBookKey] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]); // ← явно указываем тип!

      const loadChapter = () => {
        const currentBook = ALL_BOOKS[selectedBookKey];
        const book = typedBibleData.Books.find(b => b.BookId === currentBook.bookId);
        if (!book) {
          return;
        }
        const chapter = book.Chapters.find(ch => ch.ChapterId === selectedChapter)
        if(!chapter){
            return;
        }
        setVerses(chapter.Verses)

  };

  useEffect(() => {
    loadChapter();
  }, [selectedBookKey, selectedChapter]);

  return (
    <div style={{overflow: 'hidden'}}>
      <BibleTopBar
                selectedBookKey={selectedBookKey}
                selectedChapter={selectedChapter}
                onBookChange={setSelectedBookKey}
                onChapterChange={setSelectedChapter}
              />
          <div
      style={{
        position: "absolute",
        top: "56px",
        left: 0,
        right: 0,
        bottom: "90px",
        overflowY: "auto",
        paddingTop: "16px",
        paddingRight: "16px",
        paddingLeft: "16px",
        textAlign: "justify", // ← выравнивание по ширине
        textJustify: "inter-word",
        backgroundColor: "#F6F6F6",
      }}
    >
      {
      verses.map((v) => (
            <span
              key={v.VerseId}
              style={{
                display: "block",
                marginBottom: "8px",
                color: "black",
                textIndent: "1em", // отступ первой строки (по классике)
              }}
            >
              <sup
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  color: "#2c3e50",
                  marginRight: "6px",
                  verticalAlign: "baseline",
                }}
              >
                {v.VerseId}
              </sup>
              {v.Text}
            </span>
          ))}
    </div>
  </div>
  );
}