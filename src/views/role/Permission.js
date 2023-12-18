// import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadData, setOpenPopup, showAlert } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { getpermissionbyrole } from 'services/roleService';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { selectedRoleSelector } from 'store/selectors';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { createPermissionbyRole } from 'services/roleService';
import { Grid, Checkbox, FormControlLabel } from '@mui/material';
import SaveButtonTable from 'components/button/SaveButtonTable';
import ExitButton from 'components/button/ExitButton';
import React from 'react';
import { Box } from '@mui/system';

const Decentralization = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedRole = useSelector(selectedRoleSelector);
  const [isAccess, setIsAccess] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllRows, setSelectAllRows] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const openPopup = useSelector(openPopupSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: -1
  });

  // Function to update data in localStorage
  const updateLocalStorage = () => {
    localStorage.setItem('selectAll' + selectedRole.roleId, JSON.stringify(selectAll));
    localStorage.setItem('selectAllRows' + selectedRole.roleId, JSON.stringify(selectAllRows));
  };

  // Function to get data from localStorage during component initialization
  const getLocalStorageData = () => {
    const savedSelectAll = localStorage.getItem('selectAll' + selectedRole.roleId);
    const savedSelectAllRows = localStorage.getItem('selectAllRows' + selectedRole.roleId);

    if (savedSelectAll !== null) {
      setSelectAll(JSON.parse(savedSelectAll));
    }

    if (savedSelectAllRows !== null) {
      setSelectAllRows(JSON.parse(savedSelectAllRows));
    }
  };

  useEffect(() => {
    // Get data from localStorage during component initialization
    getLocalStorageData();
  }, [selectedRole]);

  const Submmit = async () => {
    let idfunction = ['0'];
    pageState.data.map((value, index) => {
      const newData = [...pageState.data];
      newData[index].hasPermissions.map(async (value1, index1) => {
        if (value1 === true) {
          idfunction = [...idfunction, newData[index].actionIds[index1]];
        }
      });
    });
    try {
      const value = {
        roleId: selectedRole.roleId,
        functionActionid: idfunction
      };
      const createPermission = await createPermissionbyRole(value);
      if (createPermission.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', createPermission.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', createPermission.message.toString()));
      }
    } catch (error) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
    // Update localStorage when submitting
    updateLocalStorage();
  };

  const handleselectAll = (isChecked) => {
    setPageState((prevState) => ({
      ...prevState,
      data: prevState.data.map((row) => ({
        ...row,
        hasPermissions: row.hasPermissions.map(() => isChecked)
      }))
    }));
    setSelectAll(isChecked);
    // Cập nhật trạng thái cho selectAllRows
    const newSelectAllRows = {};
    transformedData.forEach((row) => {
      newSelectAllRows[row.functionId] = isChecked;
    });
    setSelectAllRows(newSelectAllRows);
  };

  const handleSelectAllActions = (isChecked, functionId) => {
    setPageState((prevState) => ({
      ...prevState,
      data: prevState.data.map((row) =>
        functionId === row.functionId
          ? {
              ...row,
              hasPermissions: row.hasPermissions.map(() => isChecked)
            }
          : row
      )
    }));
    setSelectAllRows((prevSelectAllRows) => ({
      ...prevSelectAllRows,
      [functionId]: isChecked
    }));
  };

  const handleCheckboxChange = (actionId, isChecked, id) => {
    const ids = id - 1;
    const newData = [...pageState.data];
    if (newData[ids]?.actionIds && newData[ids]?.hasPermissions) {
      const actionIndex = newData[ids].actionIds.indexOf(actionId);

      const arr = newData[ids].hasPermissions.map((value, index) => {
        if (index === actionIndex) {
          return isChecked ? true : false;
        } else {
          return value;
        }
      });

      newData[ids].hasPermissions = arr;
      setPageState((prevState) => ({
        ...prevState,
        data: newData
      }));
    }
    handleSelectAllFunctionActions(newData[ids].functionId);
  };

  // XỬ lý chọn tất cả
  useEffect(() => {
    const arr_new = pageState.data.flatMap((row) => row.hasPermissions);
    let dem = 0;
    for (let i = 0; i < arr_new.length; i++) {
      if (typeof arr_new[i] === 'boolean' && arr_new[i] === false) {
        dem++;
      }
    }
    setSelectAll(dem === 0);
  }, [pageState.data]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((prevState) => ({
        ...prevState,
        isLoading: true
      }));
      const params = createSearchParams(pageState);

      const response = await getpermissionbyrole(selectedRole.roleId, params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const responseData = await response.data;

        // Create a Map to hold the actionNames for each functionName
        const functionActionMap = responseData.reduce((map, row) => {
          const { functionId, functionName, description_Function, actionId, actionName, description_Action, hasPermission } = row;
          if (map.has(functionId)) {
            map.get(functionId).actionIds.push(actionId);
            map.get(functionId).actionNames.push(actionName);
            map.get(functionId).description_Actions.push(description_Action);
            map.get(functionId).hasPermissions.push(hasPermission);
          } else {
            map.set(functionId, {
              functionId,
              functionName,
              description_Function,
              actionIds: [actionId],
              actionNames: [actionName],
              description_Actions: [description_Action],
              hasPermissions: [hasPermission]
            });
          }
          return map;
        }, new Map());

        // Transform the Map into an array of objects with the new structure
        const dataWithIds = Array.from(functionActionMap.values()).map((value, index) => ({
          id: index + 1,
          ...value,
          rowIndex: index + 1
        }));

        dispatch(setReloadData(false));

        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds,
          total: dataWithIds.length
        }));
      } else {
        setIsAccess(false);
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [
    pageState.search,
    pageState.order,
    pageState.orderDir,
    selectedRole,
    pageState.startIndex,
    pageState.pageSize,
    reloadData,
    openPopup
  ]);

  const transformedData = pageState.data.map((row) => {
    const actions = row.actionIds.map((actionId, index) => ({
      id: index + 1,
      actionId,
      actionName: row.actionNames[index],
      description_Action: row.description_Actions[index],
      hasPermission: row.hasPermissions[index]
    }));
    return {
      id: row.id,
      rowIndex: row.rowIndex,
      functionName: row.functionName,
      description_Function: row.description_Function,
      functionId: row.functionId,
      hasPermissions: row.hasPermissions,
      actions,
      selectAllAction: selectAllRows[row.functionId] || false
    };
  });
  const handleSelectAllFunctionActions = (functionId) => {
    const actionsInFunction = pageState.data.find((row) => row.functionId === functionId) || [];
    // Kiểm tra xem tất cả các action trong function có được chọn không
    const allActionsChecked = actionsInFunction.hasPermissions.every((action) => action === true);
    // Cập nhật trạng thái cho nút "Chọn" của function
    setSelectAllRows((prevSelectAllRows) => ({
      ...prevSelectAllRows,
      [functionId]: allActionsChecked
    }));
  };
  return (
    <>
      {/* <MainCard title="Phân quyền"> */}
      {isAccess ? (
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  indeterminate={selectAll !== true && selectAll !== false}
                  checked={selectAll == true}
                  onChange={(e) => handleselectAll(e.target.checked)}
                />
              }
              label="Chọn tất cả"
            />
          </Grid>
          {transformedData.map((row) => (
            <Grid item key={row.id} xs={12}>
              <Box sx={{ border: 1, py: 1, px: 2 }}>
                <h3>
                  {' '}
                  <FormControlLabel
                    control={
                      <Checkbox
                        indeterminate={row.selectAllAction !== true && row.selectAllAction !== false}
                        checked={row.selectAllAction == true}
                        onChange={(e) => {
                          handleSelectAllActions(e.target.checked, row.functionId);
                        }}
                      />
                    }
                  />
                  <span style={{ marginLeft: -20 }}>{row.description_Function}</span>
                </h3>
                {row.actions.map((action) => (
                  <FormControlLabel
                    key={action.id}
                    control={
                      <Checkbox
                        value={action.actionId}
                        checked={action.hasPermission}
                        onChange={(e) => handleCheckboxChange(action.actionId, e.target.checked, row.id)}
                      />
                    }
                    label={action.description_Action}
                  />
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <h1>Không có quyền truy cập</h1>
      )}
      {/* </MainCard> */}
      <Grid container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item>
          <SaveButtonTable onClick={Submmit} />
        </Grid>
        <Grid item>
          <ExitButton />
        </Grid>
      </Grid>
    </>
  );
};
export default Decentralization;
