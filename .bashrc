# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
[ -z "$PS1" ] && return

# -------------------- History --------------------

# don't put duplicate lines in the history. See bash(1) for more options
# don't overwrite GNU Midnight Commander's setting of `ignorespace'.
export HISTCONTROL=$HISTCONTROL${HISTCONTROL+,}ignoredups
# ... or force ignoredups and ignorespace
export HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
export PROMPT_COMMAND='history -a'
HISTSIZE=10000
HISTFILESIZE=10000
export HISTTIMEFORMAT="%d/%m/%y %T "
# variant : export HISTTIMEFORMAT="%h/%d – %H:%M:%S "

# -------------------- Bash enhancements --------------------

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
    xterm-color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
	# We have color support; assume it's compliant with Ecma-48
	# (ISO/IEC-6429). (Lack of such support is extremely rare, and such
	# a case would tend to support setf rather than setaf.)
	color_prompt=yes
    else
	color_prompt=
    fi
fi

if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*)
    PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
    ;;
*)
    ;;
esac

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# colorized man, needs to isntall most
export PAGER=most

# -------------------- Aliases --------------------

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# -------------------- Completion --------------------

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

# -------------------- GIT bashing --------------------

# append to prompt the name of the current git branch
function parse_git_branch () {
       git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

RED="\[\033[0;31m\]"
YELLOW="\[\033[0;33m\]"
GREEN="\[\033[0;32m\]"
NO_COLOUR="\[\033[0m\]"

PS1="$GREEN\u@\h$NO_COLOUR:\w$YELLOW\$(parse_git_branch)$NO_COLOUR\$ "
#PS1="\[\033[01;31m\][\u@\h\[\033[00m\]:\[\033[01;34m\]\w]\[\033[00m\]\$ "

# -------------------- PATHES --------------------

# set PATH so it includes user's private Bin if it exists
# see ~/Bin github repo
if [ -d "$HOME/Bin" ] ; then
    export PATH="$HOME/Bin:$PATH"
fi
# local, private bin
if [ -d "$HOME/bin" ] ; then
    export PATH="$HOME/bin:$PATH"
fi

PATH=$PATH:$HOME/node_modules/less/bin

# -------------------- Various functions --------------------

# XXX - mise en forme des permissions symbolic en octal (644)
# usage : ls -l | XXX
XXX() { sed -e 's/--x/1/g' -e 's/-w-/2/g' -e 's/-wx/3/g' -e 's/r--/4/g'  -e 's/r-x/5/g' -e 's/rw-/6/g' -e 's/rwx/7/g' -e 's/---/0/g' ; }

# resetperm - restaurer les permissions des repertoires et fichiers avec leurs valeurs "normales" (644/755)
# usage: resetperm <dossier>
resetperm()
{
  chmod -R u=rwX,go=rX "$@"
  chown -R ${USER}:users "$@"
}

# clock - Affiche une horloge simple
# usage: clock
clock() { while true;do clear;echo -e "\e[30;1m===========\e[0m\e[01;33m";date +"%r";echo -e "\e[0m\e[30;1m===========\e[0m";sleep 1;done; }

# ex - Extraire une archive
# usage: ex <fichier>
extract ()
{
  if [ -f $1 ] ; then
    case $1 in
      *.tar.bz2)   tar xjvf $1   ;;
      *.tar.gz)    tar xzvf $1   ;;
      *.bz2)       bunzip2 $1   ;;
      *.rar)       unrar x $1     ;;
      *.gz)        gunzip $1    ;;
      *.tar)       tar xvf $1    ;;
      *.tbz2)      tar xjvf $1   ;;
      *.tgz)       tar xzvf $1   ;;
      *.zip)       unzip $1     ;;
      *.Z)         uncompress $1;;
      *.7z)        7z x $1      ;;
      *)           echo -e "${bldred}'$1' ne peut pas etre decompresse avec ex()" ;;
    esac
  else
    echo -e "\n${bldred}'$1' n'est pas un fichier valide"
  fi
}

# getserver - Determine le serveur utilisé par un site
# usage : getserver <URL>
getserver() { curl -I $1  2>&1 | grep Server;}

# start, stop, restart, reload - Controler les services
# usage: start nom_du_daemon
start() { for arg in $*; do sudo /etc/init.d/$arg start; done }
stop() { for arg in $*; do sudo /etc/init.d/$arg stop; done }
restart() { for arg in $*; do sudo /etc/init.d/$arg restart; done }
reload() { for arg in $*; do sudo /etc/init.d/$arg reload; done }
