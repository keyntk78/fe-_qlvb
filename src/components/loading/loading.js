import LoadingComponent from 'components/Loading';

export default function Loading(props) {
  const { open } = props;

  return (
    <>
    {open ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền overlay semi-transparent
            zIndex: 9999, // Đảm bảo overlay ở trên Dialog
          }}
        ><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingComponent />
      </div></div>
      ) : ''} 
    </>
  );
}
