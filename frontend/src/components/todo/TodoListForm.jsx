import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import Validations from '../../utils/Validations';
import useToastr from '../../hooks/useToastr';
import useTodo from '../../hooks/useTodo';
import RoutePaths from '../../configs/Routes';

const TodoListForm = ({ name, onClose, onSave, editId }) => {
  const { control, handleSubmit } = useForm();
  const history = useHistory();
  const { showErrorToastr } = useToastr();
  const { editList, addList } = useTodo();

  const [processing, setProcessing] = useState(false);

  const onSubmit = async (data) => {
    try {
      setProcessing(true);
      if (editId) {
        await editList(editId, data.name.trim());
      } else {
        const result = await addList(data.name.trim());
        history.replace(RoutePaths.LIST_VIEW.replace(':id', result._id));
      }
      onSave();
      setProcessing(false);
    } catch (error) {
      showErrorToastr(error?.message || 'Something went wrong.');
      setProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog data-testid="todo-list-form" open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>{name}</DialogTitle>
      <DialogContent>
        {processing ? (
          <Box p={5} display="flex" alignItems="center" justifyContent="center">
            <CircularProgress size={25} />
          </Box>
        ) : (
          <form id="manage-todolist" onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column">
              <Controller
                control={control}
                id="name"
                name="name"
                defaultValue={name}
                rules={{ ...Validations.REQUIRED }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="dense"
                    type="text"
                    label="Name"
                    variant="outlined"
                    sx={{ mt: 2 }}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error?.message : null}
                  />
                )}
              />
            </Box>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          form="manage-todolist"
          endIcon={processing && <CircularProgress size={25} />}
          disabled={processing}
          color="primary"
          variant="contained"
          disableElevation
        >
          Save
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary" disableElevation>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoListForm;

TodoListForm.propTypes = {
  editId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
