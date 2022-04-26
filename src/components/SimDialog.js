import React, {useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import PropTypes from 'prop-types'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import SimServices from "../services/SimServices"

const initialSim = {
    name: '',
    startIccid: '',
    startImsi: '',
    count: 1,
    isActive: false
}

const SimDialog = props => {
    const [sim, setSim] = useState(initialSim)
    const { dialogAction, simToEdit, isOpen, close } = props

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        startIccid: Yup.string()
            .required('ICCID is required')
            .min(20, 'ICCID must be always 20 characters')
            .max(20, 'ICCID must be always 20 characters'),
        startImsi: Yup.string()
            .required('IMSI is required')
            .min(15, 'IMSI must be always 15 characters')
            .max(15, 'IMSI must be always 15 characters'),
        count: Yup.number()
            .required('Count is required')
            .min(1, 'Count must be at least 1')
            .max(25, 'Count must not exceed 25'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const handleAdd = event => {
        SimServices.create(sim)
            .then(response => {
                setSim(initialSim);
                console.log(response.data);
                toast.success('Batch Created Successfully')
            })
            .catch(e => {
                console.log(e.response);
                e.response.data.message.map((errorMessage) => {
                    toast.error(errorMessage)
                })
            });
    }

    const handleEdit = event => {
        SimServices.update(simToEdit.id, {imsi: sim.startImsi, isActive: sim.isActive})
            .then(response => {
                console.log(response.data);
                toast.success('Batch Edited Successfully')
            })
            .catch(e => {
                console.log(e.response);
                e.response.data.message.map((errorMessage) => {
                    toast.error(errorMessage)
                })
            });
    }

    const handleSwitchChange = name => event => {
        setSim({ ...sim, [name]: event.target.checked })
    }

    const handleChange = name => ({ target: { value } }) => {
        if(name === 'count') {
            setSim({ ...sim, [name]: parseInt(value) })
        } else {
            setSim({ ...sim, [name]: value })
        }
    }

    const getSimDetails = (simObject) => {
        SimServices.get(simObject.id).then((response) => {
            let editingSim = {
                name: simObject.imsi,
                startIccid: simObject.iccid,
                startImsi: simObject.imsi,
                count: 1,
                isActive: simObject.isActive
            }
            setSim(editingSim)
        }).catch((e) => {
            console.log(e.response)
            toast.error('Could not get Sim Details')
        })
    }

    useEffect(() => {
        if (Object.keys(simToEdit).length !== 0) {
            getSimDetails(simToEdit)
        }
    }, [simToEdit])

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={close}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {dialogAction === 'add'
                        ?
                        "Add Sim"
                        :
                        "Edit Sim"
                    }
                </DialogTitle>
                <DialogContent>
                    {dialogAction === 'add'
                        ?
                        <DialogContentText>Add sim to table.</DialogContentText>
                        :
                        <DialogContentText>Edit sim</DialogContentText>
                    }
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Batch Name"
                        type="text"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name ? 'Batch Name is Required' : ' '}
                        fullWidth
                        value={sim.name}
                        disabled={dialogAction === 'edit'}
                        onChange={handleChange('name')}
                    />
                    <TextField
                        margin="dense"
                        label="ICCID Start Range"
                        type="text"
                        fullWidth
                        {...register('startIccid')}
                        error={!!errors.startIccid}
                        helperText={errors.startIccid ? errors.startIccid?.message : ' '}
                        value={sim.startIccid}
                        disabled={dialogAction === 'edit'}
                        onChange={handleChange('startIccid')}
                    />
                    <TextField
                        margin="dense"
                        label="IMSI Start Range"
                        type="text"
                        fullWidth
                        {...register('startImsi')}
                        error={!!errors.startImsi}
                        helperText={errors.startImsi ? errors.startImsi?.message : ' '}
                        value={sim.startImsi}
                        onChange={handleChange('startImsi')}
                    />
                    {dialogAction === 'add' &&
                        <TextField
                            margin="dense"
                            label="Count (Max 25)"
                            type="number"
                            InputProps={{
                                inputProps: {
                                    max: 25, min: 1
                                },
                                pattern: '[0-9]*'
                            }}
                            fullWidth
                            {...register('count')}
                            error={!!errors.count}
                            helperText={errors.count ? errors.count?.message : ''}
                            value={sim.count}
                            onChange={handleChange('count')}
                        />
                    }
                    <FormControlLabel
                        value="isActive"
                        margin="dense"
                        control={<Switch
                            checked={sim.isActive}
                            onChange={handleSwitchChange('isActive')}
                            value="isActive"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />}
                        label="Active"
                        labelPlacement="top"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="primary">
                        Close
                    </Button>
                    {dialogAction === 'add' ?
                        <Button onClick={handleSubmit(handleAdd)} color="primary">
                            Add
                        </Button>
                        :
                        <Button onClick={handleEdit} color="primary">
                            Edit
                        </Button>
                    }
                </DialogActions>
            </Dialog>
            <ToastContainer position="bottom-right" newestOnTop />
        </div>
    )
}

SimDialog.propTypes = {
    dialogAction: PropTypes.oneOf(['add', 'edit']),
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    simToEdit: PropTypes.object,
    openForEdit: PropTypes.bool
}

export default SimDialog
