import TopBar from '../../components/TopBar'; // ← подключи TopBar
export default function TrackerTab() {
  return (
    <div>
      <TopBar title={"Трекер"} showBackButton={false} showMenuButton={false} onMenuClick={ () => {}}/>
      <div style={{minHeight: '100dvh', backgroundColor: '#F6F6F6'}}></div>
  </div>
  );
}