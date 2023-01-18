from thlr_automata import *
from thlr_regex import *
    
#[Q2]
def convert_regex(enfa, origin, destination, regex):
    if regex.children != []:
        if (regex.children[0].root == "+"):
            
            top_in = enfa.add_state()
            top_out = enfa.add_state()
            bot_in = enfa.add_state()
            bot_out = enfa.add_state()
            
            enfa.add_edge(origin,"",top_in)
            enfa.add_edge(origin,"",bot_in)
            enfa.add_edge(destination,"",top_out)
            enfa.add_edge(destination,"",bot_out)

            convert_regex(enfa, top_in, top_out,regex.children[0])
            convert_regex(enfa, bot_in, bot_out, regex.children[1])

        if (child.root == "."):
            


        if (child.root == "*")
    a = enfa.add_state()
    
#[/Q2]
