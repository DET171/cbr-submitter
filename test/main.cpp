#include <bits/stdc++.h>
using namespace std;

#define INF (1e9)

struct Node {
  int idx;
  int wt;

  Node(int _idx, int _wt) {
    idx = _idx;
    wt = _wt;
  }

  bool operator<(const Node &other) const { return wt > other.wt; }
};

struct Edge {
  int to, wt;

  Edge(int _to, int _wt) {
    to = _to;
    wt = _wt;
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  cout.tie(0);

  int n, m;
  cin >> n >> m;

  vector<vector<Edge>> g(n);
  for (int i = 0; i < m; i++) {
    int u, v, w;
    cin >> u >> v >> w;
    g[u - 1].push_back(Edge(v - 1, w));
    g[v - 1].push_back(Edge(u - 1, w));
  }

  vector<int> dist(n, INF);
  dist[0] = 0;

  priority_queue<Node> q;
  q.push(Node(0, 0));

  while (!q.empty()) {
    Node cur = q.top();
    q.pop();

    int currdist = dist[cur.idx];
    if (currdist < cur.wt) {
      continue;
    }

    for (Edge edge : g[cur.idx]) {
      int alt = currdist + edge.wt;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        q.push(Node(edge.to, alt));
      }
    }
  }

  cout << dist[n - 1] << endl;

  return 0;
}
