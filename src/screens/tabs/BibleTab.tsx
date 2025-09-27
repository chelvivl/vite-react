import TopBar from '../../components/TopBar'; // ← подключи TopBar

export default function BibleTab() {
  return (
    <div>
      <TopBar title={"Библия"} showBackButton={false}/>
      <div style={{minHeight: '100dvh', backgroundColor: '#F6F6F6'}}></div>
  </div>
  );
}