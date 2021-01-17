import networkx as nx
import json
from networkx.algorithms import community

K = nx.karate_club_graph()
G = nx.MultiDiGraph()

# first period: partition according to node attributes
for u in K.nodes(data=True):
    for v in K.nodes(data=True):
        if u[0] != v[0]:
            if (v[0] in K[u[0]]):
                G.add_edge(u[0],v[0],value=1,layer="Layer 1",sourcetype=u[1]["club"],targettype=u[1]["club"], time="Club Membership")
                G.add_edge(u[0],v[0],value=1,layer="Layer 2",sourcetype=u[1]["club"],targettype=u[1]["club"], time="Club Membership")


# next period: partition according to community attributes
comm = community.greedy_modularity_communities(K)
for u in K.nodes(data=True):
    for v in K.nodes(data=True):
        if u[0] != v[0]:
            if (v[0] in K[u[0]]):
                for c in range(len(comm)):
                    if (u[0] in comm[c]):
                        stype = c
                    if (v[0] in comm[c]):
                        ttype = c
                G.add_edge(u[0],v[0],value=1,layer="Layer 1",sourcetype=stype,targettype=ttype, time="Community Detection")
                G.add_edge(u[0],v[0],value=1,layer="Layer 2",sourcetype=stype,targettype=ttype, time="Community Detection")

# save to file
JG = nx.readwrite.json_graph.node_link_data(G)
with open("pydata.json","w") as f:
    json.dump(JG,f)
