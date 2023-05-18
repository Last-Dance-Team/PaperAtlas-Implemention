import React, { useEffect, useState } from "react";

function Filter(props: any) {

    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [ filterAccordingtoAndorOr, setFilterAccordingtoAndorOr ] = React.useState(false);
    const [value, setValue] = React.useState<number[]>([1980, 2023]);
    

        const filterAccordingToDate = () => {
            props.filterAccordingToDate(  value[0], value[1],props.elements)
        }

      const filterOr = () => {
        props.filterOr( selectedFields )
      };

      const filterAnd = () => {
        props.filterAnd( selectedFields)
      }


    return <div>Filterss</div>;
}

export default Filter;