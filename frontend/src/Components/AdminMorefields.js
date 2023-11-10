import React, { useContext, useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';

export default function AdminMorefields() {
    const { state } = useContext(Store);
    const { toggleState, userInfo } = state;
    const theme = toggleState ? 'dark' : 'light';
    const [agents, setAgents] = useState([
        { categoryId: '', agentName: '', agentId: '' },
    ]);
    const [fatchCategory, setFatchCategory] = useState();
    const [fatchAgent, setFatchAgent] = useState();
    useEffect(() => {
        const FatchAgentData = async () => {
            try {
                const response = await axios.post(`/api/user/`, { role: 'agent' });
                const datas = response.data;
                setFatchAgent(datas);
            } catch (error) { }
        };
        FatchAgentData();
    }, []);

    useEffect(() => {
        const FatchCategory = async () => {
            try {
                const response = await axios.get(`/api/category/`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                const datas = response.data;
                setFatchCategory(datas);
            } catch (error) {
                console.log(error);
            }
        };
        FatchCategory();
    }, []);

    const assignedAgentByCateHandle = (index) => {
        const category = agents[index].categoryId;
        if (category) {
            const selectedCategory1 = fatchCategory.find(categoryItem => categoryItem._id === category);
            const agentsForCategory = fatchAgent.filter(agentItem => agentItem.agentCategory === selectedCategory1._id);
            if (agentsForCategory.length > 0) {
                return agentsForCategory;
            }
        }
        return [];
    };

    const handleAgentChange = (index, key, value) => {
        console.log('Value received:', value);
        const updatedAgents = [...agents];
        updatedAgents[index] = {
            ...updatedAgents[index],
            [key]: value,
        };

        const categoryName = fatchCategory.find((categoryItem) => categoryItem._id === value);
        if (categoryName) {
            updatedAgents[index].categoryName = categoryName.categoryName;
        }

        const agentName = fatchAgent.find((agentItem) => agentItem._id === value);
        if (agentName) {
            updatedAgents[index].agentName = agentName.first_name;
        }


        if (key === 'categoryId' && value !== '') {
            const selectedCategory = fatchCategory.find(
                (categoryItem) => categoryItem._id === value
            );

            if (selectedCategory) {
                const categoryObject = {
                    categoryId: selectedCategory._id,
                    categoryName: selectedCategory.categoryName,
                };
                //     setCategories((prevCategories) => {
                //       const updatedCategories = [...prevCategories];
                //       updatedCategories[index] = categoryObject;
                //       return updatedCategories;
                //     });
            }
        }

        setAgents(updatedAgents);
    };

    const addAgent = () => {
        setAgents([...agents, { categoryId: '', agentId: '' }]);
    };
    const removeAgent = (index) => {
        const updatedAgents = [...agents];
        updatedAgents.splice(index, 1);
        setAgents(updatedAgents);
    };


    return (
        <div>
            <Card className={`projectScreenCard2 ${theme}CardBody`}>
                <Card.Header className={`${theme}CardHeader`}>Chats</Card.Header>
                <Card.Body className="d-flex flex-wrap gap-3 ">
                    {/* -------- */}

                    return (
                    <Card className="chatboxes">
                        <Card.Header>Assign</Card.Header>
                        <Card.Body>

                            <Link to={`/chatWindowScreen/`}>
                                <Button
                                    className="chatBtn"
                                    type="button"
                                >

                                </Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    );


                    {/* -------- */}
                </Card.Body>
            </Card>
        </div>
    )
}
