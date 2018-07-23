import React from 'react'

const ReadingRow = ({
    reading_level,
    reading_time
}) => {
    return (
        <tr >
            <td>
                {reading_time}
            </td>
            <td>
                {reading_level}
            </td>
        </tr>
    )
}


export default ReadingRow;