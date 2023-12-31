import React from 'react';
import '../../index.css';
import { tracuuSelector } from 'store/selectors';
import config from 'config';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { GetPhoiGocById } from 'services/congthongtinService';

const XuLyDuLieuInThu = ({ studentDataList, positionConfig, componentRef }) => {
  const phoigoc = useSelector(tracuuSelector);
  const [img, setImg] = useState();
  const [chieuNgang, setChieuNgang] = useState('19');
  const [chieuDoc, setChieuDoc] = useState('13');
  useEffect(() => {
    const fetchData = async () => {
      const response_cf = await GetPhoiGocById(phoigoc.idPhoiGoc);
      const Image = config.urlFile + 'PhoiGoc/' + response_cf.data.anhPhoi;
      setImg(Image);
      setChieuNgang(response_cf.data.chieuNgang);
      setChieuDoc(response_cf.data.chieuDoc);
    };
    fetchData();
  }, []);

  return (
    <div ref={componentRef} style={{ margin: '10px 0px', overflow: 'auto' }}>
      <div
        //className="printpage"
        style={{
          border: '1px solid #333',
          backgroundImage: `url(${img})`,
          // width: '19cm',
          // height: '13cm',
          width: chieuNgang + 'cm',
          height: chieuDoc + 'cm',
          position: 'relative',
          backgroundSize: 'cover',
          margin: '0 auto'
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

export default XuLyDuLieuInThu;
