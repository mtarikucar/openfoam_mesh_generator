import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Button, Form, Container, Row, Col, ProgressBar} from 'react-bootstrap';
import {useState} from "react";
import Canvas from "./Canvas.jsx";

const sendMeshData = async (data) => {
    console.log(data);
    const response = await axios.post('http://localhost:3000/api/openfoam/generateMesh', data);
    return response.data;
};

const validationSchema = Yup.object().shape({
    recHeight: Yup.number().required('Rectangle height is required'),
    recWidth: Yup.number().required('Rectangle width is required'),
    ellipseHeight: Yup.number().required('Ellipse height is required'),
    ellipseWidth: Yup.number().required('Ellipse width is required'),
    cellCount: Yup.number().required('Cell number is required'),
    documentName: Yup.string().required('File name is required')
});

function MeshForm() {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: sendMeshData,
        onSuccess: () => {
            queryClient.invalidateQueries('files');
        },
        onError: error => {
            setIsUploading(false);
            console.error('Error:', error);
        }
    });

    const handleCancel = () => {
        mutation.reset();
        setIsUploading(false);
        setProgress(0);
    };

    return (
        <Col xs={12} md={9}>
            <Row>
                <Formik
                    initialValues={{
                        recHeight: 100,
                        recWidth: 200,
                        ellipseHeight: 50,
                        ellipseWidth: 80,
                        cellCount: 1000,
                        documentName: 'defaultMesh',
                        xDivision: 8,
                        yDivision: 8
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, {setSubmitting}) => {
                        mutation.mutate(values);
                        setSubmitting(false);
                    }}
                >
                    {({handleSubmit, handleChange, handleBlur, values, touched, errors}) => (
                        <>
                            <Col xs={12} md={8} className="d-flex justify-content-center align-items-center">
                                <Canvas
                                    recHeight={values.recHeight}
                                    recWidth={values.recWidth}
                                    ellipseHeight={values.ellipseHeight}
                                    ellipseWidth={values.ellipseWidth}
                                    cellCount={values.cellCount}
                                />
                            </Col>
                            <Col xs={12} md={4} className="d-flex justify-content-center align-items-end">
                                <Container>
                                    <Row className="justify-content-md-center">
                                        <Col md={8}
                                             className="bg-light border-right flex-row justify-content-center align-items-center">
                                            <h1 className="text-center mb-4">Mesh Data</h1>
                                            <Form noValidate onSubmit={handleSubmit}>
                                                <Form.Group as={Col} controlId="formHorizontalRecH" className="mb-3">
                                                    <Form.Label>Rectangle Height</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="recHeight"
                                                        value={values.recHeight}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.recHeight}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.recHeight}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formHorizontalRecW" className="mb-3">
                                                    <Form.Label>Rectangle Width</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="recWidth"
                                                        value={values.recWidth}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.recWidth}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.recWidth}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formHorizontalEllipseH"
                                                            className="mb-3">
                                                    <Form.Label>Ellipse Height</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="ellipseHeight"
                                                        value={values.ellipseHeight}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.ellipseHeight}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.ellipseHeight}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formHorizontalEllipseW"
                                                            className="mb-3">
                                                    <Form.Label>Ellipse Width</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="ellipseWidth"
                                                        value={values.ellipseWidth}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.ellipseWidth}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.ellipseWidth}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formHorizontalCellNumber"
                                                            className="mb-3">
                                                    <Form.Label>Cell Number</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="cellCount"
                                                        value={values.cellCount}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.cellCount}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.cellCount}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formHorizontalFileName"
                                                            className="mb-3">
                                                    <Form.Label>File Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="documentName"
                                                        value={values.documentName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.documentName}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.documentName}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} className="mt-4 w-100">
                                                    {isUploading && (
                                                        <>
                                                            <ProgressBar now={progress} label={`${progress}%`}/>
                                                            <Button variant="danger" className="w-100 mt-3"
                                                                    onClick={handleCancel}>
                                                                Cancel Upload
                                                            </Button>
                                                        </>
                                                    )}
                                                    {!isUploading && (
                                                        <Button type="submit" className="w-100">Submit</Button>
                                                    )}
                                                </Form.Group>
                                            </Form>
                                            {mutation.isError && <div>An error occurred: {mutation.error.message}</div>}
                                            {mutation.isSuccess && <div>Data submitted successfully!</div>}
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </>
                    )}
                </Formik>
            </Row>
        </Col>
    );
}

export default MeshForm;


/**/