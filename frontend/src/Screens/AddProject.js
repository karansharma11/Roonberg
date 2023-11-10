import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';

import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Store } from '../Store';
import { Navigate, useNavigate } from 'react-router-dom';

function AddProject() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isNewProject, setIsNewProject] = useState(true);

  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmiting(true);
    // Handle form submission here
    const response = await axios.post(
      '/api/project/',
      {
        projectName: projectName,
        projectDescription: projectDescription,
        projectCategory: selectedOptions,
        createdDate: startDate,
        endDate: endDate,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );

    if (response.status === 201) {
      setIsSubmiting(false);

      toast.success(response.data.message);
      navigate('/adminProjectList');
    } else if (response.status === 500) {
      toast.error(response.data.error);
      setIsSubmiting(false);
    }
  };

  return (
    <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
      <div className="Sign-up-container-inner px-4 py-3 w-100">
        <form onSubmit={handleSubmit}>
          <h4 className="d-flex justify-content-center">Add new Project</h4>

          <TextField
            className="mb-2"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            label="Project Name"
            fullWidth
            required
          />

          <TextField
            id="outlined-multiline-static"
            onChange={(e) => setProjectDescription(e.target.value)}
            label="Project Description"
            multiline
            rows={4}
            fullWidth
            required
            variant="outlined"
          />

          <FormControl fullWidth>
            <InputLabel>Choose Options</InputLabel>
            <Select
              multiple
              required
              value={selectedOptions}
              onChange={handleChange}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <span key={value}>{value}, </span>
                  ))}
                </div>
              )}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              required
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              format="MM-DD-YYYY"
            />
            <DateField
              required
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              format="MM-DD-YYYY"
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmiting}
          >
            {isSubmiting ? 'Adding Project...' : 'Add Project'}
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default AddProject;
