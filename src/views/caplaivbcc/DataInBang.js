import React from 'react';
import '../../index.css';
import config from 'config';

const DatainBang = ({ duLieuPhoi, studentDataList, positionConfig, componentRef }) => {
  const Image = config.urlFile + 'PhoiGoc/' + duLieuPhoi.anhPhoi;
  const chieuNgang = duLieuPhoi ? duLieuPhoi.chieuNgang : 19;
  const chieuDoc = duLieuPhoi ? duLieuPhoi.chieuDoc : 13;

  return (
    <div ref={componentRef} style={{ marginTop: '10px', marginLeft: '60px' }}>
      <div
        className="printpage"
        style={{
          border: '1px solid #333',
          backgroundImage: `url(${Image})`,
          // width: '19cm',
          // height: '13cm',
          width: chieuNgang + 'cm',
          height: chieuDoc + 'cm',
          position: 'relative',
          backgroundSize: 'cover',
          marginBottom: '5px'
        }}
      >
        {Object.keys(positionConfig).map((field) => (
          <p
            key={field}
            style={{
              position: 'absolute',
              top: `${positionConfig[field].top}px`,
              left: `${positionConfig[field].left}px`,
              fontWeight: `${positionConfig[field].fontWeight}`,
              fontSize: `${positionConfig[field].fontSize}px`,
              fontFamily: `${positionConfig[field].fontFamily}`,
              color: `${positionConfig[field].color}`,
              display: `${positionConfig[field].display}`
            }}
          >
            {studentDataList[field]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default DatainBang;
