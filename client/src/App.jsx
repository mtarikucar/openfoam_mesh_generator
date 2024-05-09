import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import {Container, Row} from 'react-bootstrap';
import MeshForm from "./components/MeshForm.jsx";
import FileList from "./components/FileList.jsx";

function App() {


    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <FileList/>
                <MeshForm/>
            </Row>
        </Container>
    )
}

export default App
