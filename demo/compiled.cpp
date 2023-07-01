int plus(int a, int b){
    return a + b;
}
int doubleValue(int a){
    return plus (a, a);
}

int main(int){
    doubleValue(5);
}