import React, { useEffect } from "react";
import RichTextEditor from "react-rte";

export default function MyStatefulEditor({ markup, value, onChange, clearEditor, setClearEditor }) {
  const [editorValue, setEditorValue] = React.useState(RichTextEditor.createValueFromString(markup, "html"));

  useEffect(() => {
    if (clearEditor) {
      setEditorValue(RichTextEditor.createEmptyValue());
      setClearEditor(false);
    }
  }, [clearEditor, setClearEditor]);

  const handleEditorChange = (newValue) => {
    setEditorValue(newValue);
    if (onChange) {
      onChange(newValue.toString("html"));
    }
  };

  return (
    <div>
      <RichTextEditor value={editorValue} onChange={handleEditorChange} />
    </div>
  );
}




// import React, { useState } from "react";
// import RichTextEditor from "react-rte";

// export default function MyStatefulEditor({ markup, onChange ,blank }) {
//   const [value, setValue] = useState(RichTextEditor.createValueFromString(markup, "html"));
  

//   const handleEditorChange = (newValue) => {
//     setValue(newValue);
//     if (onChange) {
//       onChange(newValue.toString("html"));
//     }
    
//   };

//   const handleSendMessage = () => {
//     // Perform actions to send the message

//     // After sending, clear the editor's content
//     setValue(RichTextEditor.createEmptyValue());
//   };
//   // if(blank){
//   //   handleSendMessage();
  
//   // }

//   return (
//     <div>
//       <RichTextEditor value={value} onChange={handleEditorChange} />
//       {/* <button onClick={handleSendMessage}>Send Message</button> */}
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import RichTextEditor from "react-rte";

// export default function MyStatefulEditor({ markup, onChange }) {
//   const [value, setValue] = useState(RichTextEditor.createValueFromString(markup, "html"));

//   useEffect(() => {
//     setValue(RichTextEditor.createValueFromString(markup, "html"));
//   }, [markup]);

//   const handleEditorChange = (newValue) => {
//     setValue(newValue);
//     if (onChange) {
//       onChange(newValue.toString("html"));
//     }
//   };

//   return <RichTextEditor value={value} onChange={handleEditorChange} />;
// }


// import React, { Component } from "react";
// import RichTextEditor from "react-rte";

// export default class MyStatefulEditor extends Component {

//   value = RichTextEditor.createValueFromString(this.props.markup, "html");

//   state = {
//     value: this.value,
//   };



//   onChange = (value) => {
  
//     this.setState({ value });
//     if (this.props.onChange) {
//       console.log('this.props.markup ',value)
//       value=''; 
//       // Send the changes up to the parent component as an HTML string.
//       // This is here to demonstrate using `.toString()` but in a real app it
//       // would be better to avoid generating a string on each change.
//       this.props.onChange(value.toString("html"));
     
//     }

//   };

//   render() {
//     return <RichTextEditor value={this.state.value} onChange={this.onChange} />;
//   }
// }
