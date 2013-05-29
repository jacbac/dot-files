# move in directory aliases
alias cd..='cd ..'   #for typing error
alias ..='cd ..'
alias ...='cd ../../'
alias ....='cd ../../../'
alias .....='cd ../../../../'
alias ......='cd ../../../../../'

# ls aliases
alias ll='ls -la' # use a long listing format
alias ll-oct='ls -alF | XXX' # use a long listing format with ugo rights in octal
alias la='ls -A'
alias l='ls -CF'
alias l.='ls -d .* --color=auto'
alias lf='ls -Gl | grep ^d' #Only list directories
alias lsd='ls -Gal | grep ^d' #Only list directories, including hidden ones

# history bash aliases
alias hs='history | grep --color=auto'

# text-editor aliases
alias subtxt='sublime-text'
alias sub-txt='sublime-text'

# git aliases
alias gl="git log --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
alias gs="git status" #N.B. Overrides ghostscript (probably not important if you don't use it)
alias gd="git diff"
alias gc="git commit -m"
alias gb="git checkout -b"
alias gm="git merge"
alias gitsearch='git rev-list --all | xargs git grep -F'

# ssh aliases
alias sshatl="ssh atlantic@78.109.85.15"
alias sshgit="ssh git@sd-39300.dedibox.fr"
alias sshtooma="ssh toog@193.189.143.232"
