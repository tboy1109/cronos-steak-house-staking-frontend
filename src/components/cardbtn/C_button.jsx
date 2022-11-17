import { isDisabled } from '@testing-library/user-event/dist/utils';
import * as React from 'react';
import './C_button.css';


const CButton = (props) => {

	return(
		
			props.disable === true ?
			<button type='button' className="Dcardbtn" style={{width:props.width}} disabled>{props.value}</button>
			:<button type='button' className="Ecardbtn" style={{width:props.width}} onClick={props.onClick}>{props.value}</button>
		
		);	
}
export default CButton;