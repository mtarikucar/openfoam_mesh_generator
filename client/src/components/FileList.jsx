import { useState, useEffect } from 'react';
import { Col, Button, Table } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function FileList() {
    const [previousFiles, setPreviousFiles] = useState([]);

    // File download handler
    const handleDownload = (name) => {
        axios({
            url: `http://localhost:3000/api/files/download?filename=${name}`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}_openfoam.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }).catch(error => {
            console.error('Download error:', error);
            alert(`Download failed: ${error.message}`);
        });
    };

    const { data: files, isError, isLoading, error } = useQuery({
        queryKey: ['files'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:3000/api/files/list');
            return response.data;
        },
        staleTime: 300000,
        cacheTime: 600000,
        onSuccess: (newFiles) => {
            if (previousFiles.length && newFiles.length) {
                const newFileNames = newFiles.map(file => file.name);
                const previousFileNames = previousFiles.map(file => file.name);
                const isFileNew = newFileNames.filter(name => !previousFileNames.includes(name)).length > 0;
                if (isFileNew) {
                    setPreviousFiles(newFiles);
                }
            } else {
                setPreviousFiles(newFiles);
            }
        }
    });

    useEffect(() => {
        if (files) {
            setPreviousFiles(files);
        }
    }, [files]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <Col xs={12} md={3} className="bg-light border-right">
            <h2 className="text-center mt-3">Files</h2>
            <Table hover className="w-100">
                <tbody>
                {files.map((file, index) => (
                    <tr key={index} style={{ backgroundColor: !previousFiles.map(f => f.name).includes(file.name) ? 'lightgreen' : 'transparent' }}>
                        <td>{file.name}</td>
                        <td className="text-right">
                            <Button variant="link" onClick={() => handleDownload(file.name)}>
                                <div style={{ height: '50px', width: '50px' }}>
                                    <svg viewBox="0 0 48 48" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
                                            stroke="#000000" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Col>
    );
}

export default FileList;
