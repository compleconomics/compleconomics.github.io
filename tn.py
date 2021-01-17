import networkx as nx
import json

G = nx.DiGraph()
G.add_edge("eins", "zwei", value=10, layer= "Work", time="Q1", sourcetype="low", targettype="high")
G.add_edge("eins", "drei", value=100, layer="Work", time="Q1", sourcetype="low", targettype="middle")
G.add_edge("eins", "zwei", value=10, layer= "Work", time="Q2", sourcetype="low", targettype="high")
G.add_edge("zwei", "drei", value=100, layer="Work", time="Q2", sourcetype="high", targettype="middle")
G.add_edge("vier", "zwei", value=10, layer= "Leisure", time="Q1", sourcetype="low", targettype="high")
G.add_edge("5", "drei", value=100, layer="Leisure", time="Q1", sourcetype="low", targettype="middle")
G.add_edge("vier", "zwei", value=10, layer= "Leisure", time="Q2", sourcetype="low", targettype="high")
G.add_edge("zwei", "drei", value=100, layer="Leisure", time="Q2", sourcetype="high", targettype="middle")
JG = nx.readwrite.json_graph.node_link_data(G)
with open("pydata.json","w") as f:
    json.dump(JG,f)
