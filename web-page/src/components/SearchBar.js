import React from 'react';
import Radio from '@material-ui/core/Radio';
import FormControl from "@material-ui/core/FormControl";
import {FormControlLabel, FormLabel, RadioGroup} from "@material-ui/core";

export default function RadioButtons(props) {
    const [selectedValue, setSelectedValue] = React.useState('All');
    const handleChange = (event) => {
        console.log(selectedValue)
        setSelectedValue(event.target.value);
        props.setCategory(event.target.value);
        console.log(selectedValue)
    };
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend"></FormLabel>
            <RadioGroup row aria-label="position" name="position" defaultValue="All">
                <FormControlLabel
                    value="All"
                    control={<Radio checked={selectedValue == "All"} onChange={handleChange} color="primary" />}
                    label="All"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value="Tech"
                    control={<Radio checked={selectedValue == "Tech"} onChange={handleChange} color="primary" />}
                    label="Tech"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value="Life Style"
                    control={<Radio checked={selectedValue == "Life Style"} onChange={handleChange} color="primary" />}
                    label="Life Style"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value="News"
                    control={<Radio checked={selectedValue == "News"} onChange={handleChange} color="primary" />}
                    label="News"
                    labelPlacement="start"
                />
            </RadioGroup>
        </FormControl>
    );
}
