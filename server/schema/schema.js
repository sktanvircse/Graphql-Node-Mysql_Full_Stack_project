const { projects, clients } = require('../sampleData.js');

const { Project } = require('../models/project.js');
const { Client } = require('../models/clients.js');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');

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
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations,
})