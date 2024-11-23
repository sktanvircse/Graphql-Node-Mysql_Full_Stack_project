const { Project } = require('../models/project.js');
const { Client } = require('../models/clients.js');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull, GraphQLBoolean, GraphQLEnumType } = require('graphql');

//project type
const ProjectType = new GraphQLObjectType({
    name: 'project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findByPk(parent.clientId);
            }
        }
    })
});

//client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.findAll();
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findByPk(args.id);
            }
        },

        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.findAll();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findByPk(args.id);
            }
        }
    }
});


//Mutations
const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //Add Client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
                completed: { type: GraphQLNonNull(GraphQLBoolean) },
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                    completed: args.completed,
                });
                return client.save();
            }
        },
        //Delete Client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const client = new Client({
                    id: args.id,
                });
                return client.destroy();
            }
        },

        //Add Projrct
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'Not_Started': { value: 'Not_Started' },
                            'In_Progress': { value: 'In_Progress' },
                            'Completed': { value: 'Completed' },
                        }
                    }),
                    defaultValue: 'Not_Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project.save();
            },
        },
        //Delete Project 
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new Project({
                    id: args.id,
                });
                return project.destroy();
            }
        },
        //Update Project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'Not_Started': { value: 'Not_Started' },
                            'In_Progress': { value: 'In_Progress' },
                            'Completed': { value: 'Completed' },
                        }
                    }),
                },
                clientId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Client.findByPk(args.clientId)  // Check if client exists
                    .then((client) => {
                        if (!client) {
                            throw new Error('Client does not exist');
                        }
                        return Project.findByPk(args.id)
                            .then((project) => {
                                if (!project) {
                                    throw new Error('Project not found');
                                }
                                return project.update({
                                    name: args.name,
                                    description: args.description,
                                    status: args.status,
                                    clientId: args.clientId,
                                });
                            });
                    })
                    .catch((error) => {
                        throw new Error(error.message);
                    });
            }
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations,
})