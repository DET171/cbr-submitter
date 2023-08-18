#include <bits/stdc++.h>
#define l long
#define d double
#define str string
#define ll l l
#define ull unsigned ll
#define endl "\n"
#define fori(x, y) for (ll i = x; i < y; i++)
#define in(x) cin >> x;
#define outln(x) cout << x << endl;
#define out(x) cout << x << " ";
#define pb push_back
#define pf push_front
using namespace std;

int main(int argc, char** argv) {
	ios_base::sync_with_stdio(false);
	cin.tie(nullptr);

	ll N, M;
	cin >> N >> M;
	deque<ll> A, B, X;
	fori (0, N) {
		ll x;
		cin >> x;
		A.pf(x);
		X.pb(x);
	}
	fori (0, M) {
		ll x;
		cin >> x;
		B.pb(x);
	}

	fori (0, N) {
		ll x = X[i];
		auto xx = find(B.begin(), B.end(), x);

		if (xx == B.end()) A.erase(std::remove(A.begin(), A.end(), x), A.end());
	}

	for (auto i: A) {
		out(i);
	}
}