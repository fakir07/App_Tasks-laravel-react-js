import axios from "axios";
import { useEffect, useState } from "react"
import useCatigories from "../../custom/useCatigories";

export default function Tasks() {

    const [tasks, SetTasks] = useState([]);
    const [page, SetPage] = useState(1);
    const [catigories, SetCatigories] = useState([])

    useEffect(() => {
        if (!catigories.length) {
            fetchCatigories();
        }
        fetchTask();
    }, [page])


    // function pour appel custom hooke use Catigories
    const fetchCatigories = async () => {

        const fetchedcat = await useCatigories();
        SetCatigories(fetchedcat);
    }

    const fetchPrevNextTasks = (link) => {
        const url = new URL(link);
        SetPage(url.searchParams.get('page'));
    }

    const fetchTask = async () => {
        try {
            const response = await axios.get(`/api/tasks?page=${page}`);
            SetTasks(response.data);
        } catch (error) {
            console.log(error);
        }

    }
    const checkIftask = (done) => (
        done ? (
            <span className="badge bg-success p-2">termines</span>

        )
            : (
                <span className="badge bg-danger p-2">en attente</span>
            )
    )

    const renderPagination = () => (
        <ul className="pagination">
            {
                tasks.links?.map((link, index) => (
                    <li className={`page-item  ${link.active ? " active" : ""}`} key={index}>
                        <a
                            style={{ cursor: "pointer" }}
                            className="page-link"
                            onClick={() => fetchPrevNextTasks(link.url)}
                        >
                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                        </a>
                    </li>
                ))
            }
        </ul>

    )


    return (
        <>
            <div className="row my-5">
                <div className="col-md-9 ">
                    <div className="card">
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Catigories</th>
                                        <th>Satuts</th>
                                        <th>date </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tasks.data?.map(task => (
                                            <tr key={task.id}>
                                                <td> {task.id}</td>
                                                <td> {task.title}</td>
                                                <td width="40%"> {task.description}</td>
                                                <td> {task.categories.name}</td>
                                                <td> {
                                                    checkIftask(task.done)
                                                }</td>
                                                <td> {task.created_at}</td>
                                                <td>
                                                    <span className="btn btn-warning mx-2"> <i class="fa-solid fa-pen-to-square"></i></span>
                                                    <span className="btn btn-danger "> <i class="fa-solid fa-trash-can"></i></span>

                                                </td>


                                            </tr>
                                        ))



                                    }
                                </tbody>
                            </table>

                            <div className="my-4 d-flex justify-content-between">
                                <div>
                                    Showing {tasks.from || 0} to {tasks.to || 0}
                                    from {tasks.total} results
                                </div>
                                <div>
                                    {renderPagination()}

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header text-center bg-white">
                            <h5 className="mt-2"> Fillter by Catigorise</h5>
                        </div>
                        <div className="card-body">

                        </div>
                    </div>

                </div>

            </div>


        </>
    )
}