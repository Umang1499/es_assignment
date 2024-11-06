import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

const TodoItemForm = ({ onClose, onSave, todoData }) => {
  const { control, handleSubmit } = useForm();
  const { addItem, editItem } = useTodo();
  const { showErrorToastr } = useToastr();
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (data) => {
    try {
      setProcessing(true);
      const payload = { title: data.title.trim(), detail: data.detail.trim() };
      if (todoData) {
        await editItem(todoData._id, payload);
        onSave();
      } else {
        await addItem(payload);
        onSave();
      }
      setProcessing(false);
    } catch (error) {
      showErrorToastr(error?.message || 'Something went wrong.');
      setProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog data-testid="todo-item-form" open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>{todoData?.title || 'New Todo'}</DialogTitle>
      <DialogContent>
        {processing ? (
          <Box p={5} display="flex" alignItems="center" justifyContent="center">
            <CircularProgress size={25} />
          </Box>
        ) : (
          <form id="manage-todoitem" onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column">
              <Controller
                control={control}
                id="title"
                name="title"
                defaultValue={todoData?.title}
                rules={{ ...Validations.REQUIRED }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="dense"
                    type="text"
                    label="Title"
                    variant="outlined"
                    sx={{ mt: 2 }}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error?.message : null}
                  />
                )}
              />
              <Controller
                control={control}
                id="detail"
                name="detail"
                defaultValue={todoData?.detail}
                rules={{ ...Validations.REQUIRED }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="dense"
                    label="Description"
                    variant="outlined"
                    sx={{ mt: 2 }}
                    minRows={3}
                    multiline
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
          form="manage-todoitem"
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

export default TodoItemForm;

TodoItemForm.defaultProps = {
  todoData: null,
};

TodoItemForm.propTypes = {
  todoData: PropTypes.shape({
    title: PropTypes.string,
    descrption: PropTypes.string,
    id: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
