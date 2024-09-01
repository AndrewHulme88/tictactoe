# Tic Tac Toe game in Ruby

class Gameboard
  def initialize
    @board = Array.new(9, "")
  end

  def get_board
    @board
  end

  def reset_board
    @board = Array.new(9, "")
  end

  def set_cell(index, marker)
    if index >= 0 && index < @board.length && @board[index] == ""
      @board[index] = marker
      true
    else
      false
    end
  end

  def is_winner(marker)
    winning_combinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    winning_combinations.any? do |combo|
      combo.all? { |pos| @board[pos] == marker }
    end
  end

  def is_tie
    !@board.include?("")
  end
end

class Player
  attr_reader :name, :marker

  def initialize(name, marker)
    @name = name
    @marker = marker
  end
end

class GameController
  def initialize
    @player1 = Player.new("Player 1", "O")
    @computer = Player.new("Computer", "X")
    @gameboard = Gameboard.new
  end

  def get_heuristic_move(board)
    # 1. Take the center if available
    return 4 if board[4] == ""

    # 2. Look for winning moves
    9.times do |i|
      next unless board[i] == ""
      board[i] = @computer.marker
      if @gameboard.is_winner(@computer.marker)
        board[i] = ""
        return i
      end
      board[i] = ""
    end

    # 3. Look for blocking moves
    9.times do |i|
      next unless board[i] == ""
      board[i] = @player1.marker
      if @gameboard.is_winner(@player1.marker)
        board[i] = ""
        return i
      end
      board[i] = ""
    end

    # 4. Play opposite side if possible
    player_last_move = find_last_move(board, @player1.marker)
    if player_last_move != -1 && board[8 - player_last_move] == ""
      return 8 - player_last_move
    end

    # 5. Play a corner if available
    corners = [0, 2, 6, 8].select { |i| board[i] == "" }
    return corners.sample if corners.any?

    # 6. Play any available cell
    empty_cells = board.each_index.select { |i| board[i] == "" }
    empty_cells.sample || 0
  end


  def find_last_move(board, marker)
    board.rindex(marker) || -1
  end

  def play_game
    @gameboard.reset_board
    current_player = @player1

    loop do
      puts "Current board:"
      puts @gameboard.get_board.each_slice(3).map { |row| row.join(' | ') }.join("\n---------\n")
      if current_player == @player1
        puts "Enter a move for #{current_player.name} (0-8), or 'q' to quit:"
        input = gets.chomp
        break if input == 'q'
        index = input.to_i
      else
        index = get_heuristic_move(@gameboard.get_board)
        puts "Computer chose position: #{index}"
      end

      if @gameboard.set_cell(index, current_player.marker)
        if @gameboard.is_winner(current_player.marker)
          puts @gameboard.get_board.each_slice(3).map { |row| row.join(' | ') }.join("\n---------\n")
          puts "Game Over! #{current_player.name} wins!"
          break
        elsif @gameboard.is_tie
          puts @gameboard.get_board.each_slice(3).map { |row| row.join(' | ') }.join("\n---------\n")
          puts "Game Over! It's a tie!"
          break
        end
        current_player = current_player == @player1 ? @computer : @player1
      else
        puts "Invalid move. Try again."
      end
    end
  end

  def start_game
    loop do
      puts "Welcome to Tic Tac Toe!"
      puts "1. Play against the computer"
      puts "2. Quit"
      print "Enter your choice: "
      choice = gets.chomp
      case choice
      when '1'
        play_game
      when '2'
        puts "Goodbye!"
        break
      else
        puts "Invalid choice. Please try again."
      end

      print "Do you want to play again? (y/n): "
      again = gets.chomp
      break unless again.downcase == 'y'
    end
  end
end

game = GameController.new
game.start_game
