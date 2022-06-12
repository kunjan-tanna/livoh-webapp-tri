/**
 * Delete Confirmation Dialog
 */
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class DeleteConfirmationDialog extends Component {

   state = {
      open: false
   }

   // open dialog
   open() {
      this.setState({ open: true });
   }

   // close dialog
   close() {
      this.setState({ open: false });
   }

   render() {
      const { title, message, onConfirm } = this.props;
      return (
         <Dialog
            open={this.state.open}
            onClose={() => this.close()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {message}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button style={{ backgroundColor: 'red' }} className="text-white" variant='contained'   onClick={() => this.close()}>Cancel</Button>
               <Button style={{ backgroundColor: '#3C16D5' }} className="text-white" variant='contained'  onClick={onConfirm}>Yes</Button>
            </DialogActions>
         </Dialog>
      );
   }
}

export default DeleteConfirmationDialog;
