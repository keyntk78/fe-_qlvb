import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLichSuXacMinhVanBangByID } from 'services/xacminhvanbangService';
import { selectedCCCDSelector } from 'store/selectors';
import Detaillichsumotnguoi from './Detaillichsumotnguoi';
import Detaillichsunhieunguoi from './Detaillichsunhieunguoi';

const Detaillichsu = () => {
  const [dataIDHS, setDataIDHS] = useState({});
  const selectedCCCD = useSelector(selectedCCCDSelector);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLichSuXacMinhVanBangByID(selectedCCCD.id);
        setDataIDHS(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [selectedCCCD.id]);

  return dataIDHS && dataIDHS.hocSinhs && dataIDHS.hocSinhs.length < 2 ? (
    <Detaillichsumotnguoi data={dataIDHS} />
  ) : (
    <Detaillichsunhieunguoi data={dataIDHS} />
  );
};

export default Detaillichsu;
