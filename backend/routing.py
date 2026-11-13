import heapq
import math

# Stage 2: Road Network Representation (Macro-Graph)
# Nodes represent major Indian logistics hubs with (lat, lon)
NODES = {
    "Delhi": (28.6139, 77.2090),
    "Mumbai": (19.0760, 72.8777),
    "Bangalore": (12.9716, 77.5946),
    "Chennai": (13.0827, 80.2707),
    "Kolkata": (22.5726, 88.3639),
    "Hyderabad": (17.3850, 78.4867),
    "Pune": (18.5204, 73.8567),
    "Ahmedabad": (23.0225, 72.5714),
    "Jaipur": (26.9124, 75.7873),
    "Nagpur": (21.1458, 79.0882) # Central Hub
}

# Edges: (destination, distance_km, base_time_hrs)
GRAPH = {
    "Delhi": [("Jaipur", 280, 5.0), ("Ahmedabad", 940, 16.0), ("Nagpur", 1050, 18.0), ("Kolkata", 1530, 27.0)],
    "Mumbai": [("Pune", 150, 3.0), ("Ahmedabad", 520, 9.0), ("Nagpur", 810, 14.0), ("Bangalore", 980, 17.0)],
    "Bangalore": [("Mumbai", 980, 17.0), ("Hyderabad", 570, 10.0), ("Chennai", 350, 6.5), ("Pune", 840, 14.5)],
    "Chennai": [("Bangalore", 350, 6.5), ("Hyderabad", 630, 11.0), ("Kolkata", 1670, 30.0)],
    "Kolkata": [("Delhi", 1530, 27.0), ("Nagpur", 1120, 21.0), ("Chennai", 1670, 30.0)],
    "Hyderabad": [("Bangalore", 570, 10.0), ("Chennai", 630, 11.0), ("Nagpur", 500, 9.0), ("Pune", 590, 11.0)],
    "Pune": [("Mumbai", 150, 3.0), ("Bangalore", 840, 14.5), ("Hyderabad", 590, 11.0), ("Nagpur", 710, 13.0)],
    "Ahmedabad": [("Mumbai", 520, 9.0), ("Delhi", 940, 16.0), ("Jaipur", 670, 11.5)],
    "Jaipur": [("Delhi", 280, 5.0), ("Ahmedabad", 670, 11.5), ("Nagpur", 920, 16.0)],
    "Nagpur": [("Delhi", 1050, 18.0), ("Mumbai", 810, 14.0), ("Kolkata", 1120, 21.0), ("Hyderabad", 500, 9.0), ("Pune", 710, 13.0), ("Jaipur", 920, 16.0)]
}

def haversine(coord1, coord2):
    """Calculates great-circle distance between two coordinates to serve as an A* heuristic."""
    R = 6371  # Earth radius in km
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1-a))

def get_edge_cost(u, v, base_time, mode, incidents):
    """Stage 5: Disruption-Aware Cost Function."""
    cost = base_time
    penalties = []
    if mode == "risk_aware":
        node_v_coords = NODES[v]
        for inc in incidents:
            if inc['status'] == 'Active':
                # If an incident is within 100km of the destination node, add penalties
                dist_to_hazard = haversine(node_v_coords, (inc['latitude'], inc['longitude']))
                if dist_to_hazard < 100:
                    penalty = 5.0 if inc['severity'] == 'High' else 2.0
                    cost += penalty
                    penalties.append(f"{inc['incident_type']} near {v} (+{penalty}h)")
    return cost, penalties

# Stage 3: Dijkstra's Algorithm
def dijkstra(source, dest, mode, incidents, penalized_edges=None):
    if penalized_edges is None: penalized_edges = set()
    
    pq = [(0, source, [], 0)] # (accumulated_cost, current_node, path, accumulated_distance)
    visited = set()
    
    while pq:
        cost, current, path, dist = heapq.heappop(pq)
        
        if current in visited: continue
        visited.add(current)
        path = path + [current]
        
        if current == dest:
            return cost, path, dist
            
        for neighbor, edge_dist, base_time in GRAPH.get(current, []):
            if (current, neighbor) in penalized_edges or (neighbor, current) in penalized_edges:
                continue # Skip this edge entirely to force alternatives
                
            edge_cost, _ = get_edge_cost(current, neighbor, base_time, mode, incidents)
            if neighbor not in visited:
                heapq.heappush(pq, (cost + edge_cost, neighbor, path, dist + edge_dist))
    return float('inf'), [], 0

# Stage 4: A* Algorithm
def a_star(source, dest, mode, incidents, penalized_edges=None):
    if penalized_edges is None: penalized_edges = set()
    
    # Priority Queue: (f_score, g_score, current_node, path, accumulated_distance)
    # f_score = g_score (actual cost) + h_score (heuristic cost to dest)
    dest_coords = NODES[dest]
    
    # Assume an optimistic highway speed of 80km/h for the time heuristic
    h_start = haversine(NODES[source], dest_coords) / 80.0 
    pq = [(h_start, 0, source, [], 0)] 
    
    # Track the lowest g_score to each node
    g_scores = {source: 0}
    
    while pq:
        f, g, current, path, dist = heapq.heappop(pq)
        path = path + [current]
        
        if current == dest:
            return g, path, dist
            
        for neighbor, edge_dist, base_time in GRAPH.get(current, []):
            if (current, neighbor) in penalized_edges or (neighbor, current) in penalized_edges:
                continue
                
            edge_cost, _ = get_edge_cost(current, neighbor, base_time, mode, incidents)
            tentative_g = g + edge_cost
            
            if tentative_g < g_scores.get(neighbor, float('inf')):
                g_scores[neighbor] = tentative_g
                h = haversine(NODES[neighbor], dest_coords) / 80.0
                f = tentative_g + h
                heapq.heappush(pq, (f, tentative_g, neighbor, path, dist + edge_dist))
                
    return float('inf'), [], 0

# Stage 6: Generate Alternatives via Edge Penalization
def generate_route_options(source, dest, mode, incidents, use_astar=True):
    algorithm = a_star if use_astar else dijkstra
    options = []
    
    # 1. Find Primary Optimal Route
    opt_cost, opt_path, opt_dist = algorithm(source, dest, mode, incidents)
    if not opt_path: return []
    
    options.append({
        "id": "opt_1",
        "type": "Optimal",
        "path": opt_path,
        "nodes_coords": [{"name": n, "lat": NODES[n][0], "lng": NODES[n][1]} for n in opt_path],
        "cost_hrs": round(opt_cost, 1),
        "distance_km": opt_dist,
        "algorithm": "A*" if use_astar else "Dijkstra"
    })
    
    # 2. Find Alternative 1 (Penalize the middle edge of the optimal path)
    if len(opt_path) > 2:
        mid_idx = len(opt_path) // 2
        penalized_edges = {(opt_path[mid_idx-1], opt_path[mid_idx])}
        alt_cost, alt_path, alt_dist = algorithm(source, dest, mode, incidents, penalized_edges)
        
        if alt_path and alt_path != opt_path:
            options.append({
                "id": "alt_1",
                "type": "Alternative",
                "path": alt_path,
                "nodes_coords": [{"name": n, "lat": NODES[n][0], "lng": NODES[n][1]} for n in alt_path],
                "cost_hrs": round(alt_cost, 1),
                "distance_km": alt_dist,
                "algorithm": "A*" if use_astar else "Dijkstra"
            })
            
    return options