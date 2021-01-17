import networkx as nx
import json
from networkx.algorithms import community

K = nx.karate_club_graph()
comm = community.greedy_modularity_communities(K)

# partition according to node attributes
G = nx.DiGraph()
for u in K.nodes(data=True):
    for v in K.nodes(data=True):
        if u[0] != v[0]:
            if (v[0] in K[u[0]]):
                G.add_edge(u[0],v[0],value=1,sourcetype=u[1]["club"],targettype=u[1]["club"])
JG = nx.readwrite.json_graph.node_link_data(G)
with open("pydata.json","w") as f:
    json.dump(JG,f)




# G = nx.DiGraph()
# G.add_edge("eins", "zwei", value=10, layer= "Work", time="Q1", sourcetype="low", targettype="high")
# G.add_edge("eins", "drei", value=100, layer="Work", time="Q1", sourcetype="low", targettype="middle")
# G.add_edge("eins", "zwei", value=10, layer= "Work", time="Q2", sourcetype="low", targettype="high")
# G.add_edge("zwei", "drei", value=100, layer="Work", time="Q2", sourcetype="high", targettype="middle")
# G.add_edge("vier", "zwei", value=10, layer= "Leisure", time="Q1", sourcetype="low", targettype="high")
# G.add_edge("55", "drei", value=100, layer="Leisure", time="Q1", sourcetype="low", targettype="middle")
# G.add_edge("vier", "zwei", value=10, layer= "Leisure", time="Q2", sourcetype="low", targettype="high")
# G.add_edge("zwei", "drei", value=100, layer="Leisure", time="Q2", sourcetype="high", targettype="middle")
