import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAlertSelector } from 'store/selectors';
import { hideAlert } from 'store/actions';

export default function Alert() {
  const showAlerts = useSelector(showAlertSelector);
  const dispatch = useDispatch();
  const prevAlertIdsRef = useRef([]);

  useEffect(() => {
    showAlerts.forEach((alert) => {
      if (!prevAlertIdsRef.current.includes(alert.alertId)) {
        toast[alert.alertType](alert.alertContent, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          onClose: () => {
            dispatch(hideAlert(alert.alertId));
          }
        });
      }
    });

    prevAlertIdsRef.current = showAlerts.map((alert) => alert.alertId);
  }, [showAlerts, dispatch]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}
