USE [master]
GO
/****** Object:  Database [db]    Script Date: 13/05/2022 11:23:13 ******/
CREATE DATABASE [db]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'fatto', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\fatto.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'fatto_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\fatto_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [db] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [db] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [db] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [db] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [db] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [db] SET ARITHABORT OFF 
GO
ALTER DATABASE [db] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [db] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [db] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [db] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [db] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [db] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [db] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [db] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [db] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [db] SET  DISABLE_BROKER 
GO
ALTER DATABASE [db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [db] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [db] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [db] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [db] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [db] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [db] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [db] SET RECOVERY FULL 
GO
ALTER DATABASE [db] SET  MULTI_USER 
GO
ALTER DATABASE [db] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [db] SET DB_CHAINING OFF 
GO
ALTER DATABASE [db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [db] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [db] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [db] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'db', N'ON'
GO
ALTER DATABASE [db] SET QUERY_STORE = OFF
GO
USE [db]
GO
/****** Object:  Table [dbo].[Tarefa]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tarefa](
	[idtarefa] [int] IDENTITY(1,1) NOT NULL,
	[nometarefa] [nchar](45) NOT NULL,
	[custo] [money] NOT NULL,
	[datalimite] [date] NOT NULL,
	[ordemapresentacao] [int] NOT NULL,
 CONSTRAINT [PK_Tarefa] PRIMARY KEY CLUSTERED 
(
	[idtarefa] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[altera_ordem_aparesentacao_botao]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Fabio Curtis Volpe
-- Create date: 13/05/2022
-- Description:	Altera ordem de visualizacao
-- =============================================
CREATE PROCEDURE [dbo].[altera_ordem_aparesentacao_botao]
	@idtarefa INT,
	@mov VARCHAR(1)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idtmp INT;
	DECLARE @ordemapresentacaotmp INT;
	DECLARE @ordemapresentacao INT;

	SET @idtmp = NULL;

	SELECT @ordemapresentacao = [Tarefa].[ordemapresentacao]
	FROM [Tarefa] WHERE [Tarefa].[idtarefa] = @idtarefa;

    IF @mov = 'S'
	BEGIN
		SELECT @idtmp = [Tarefa].[idtarefa], @ordemapresentacaotmp = [Tarefa].[ordemapresentacao]
		FROM [Tarefa] WHERE [Tarefa].[ordemapresentacao] = (SELECT MAX([Tarefa].[ordemapresentacao]) FROM [Tarefa] WHERE [Tarefa].[ordemapresentacao] < @ordemapresentacao);
	END
	ELSE
	BEGIN
		SELECT @idtmp = [Tarefa].[idtarefa], @ordemapresentacaotmp = [Tarefa].[ordemapresentacao] 
		FROM [Tarefa] WHERE [Tarefa].[ordemapresentacao] = (SELECT MIN([Tarefa].[ordemapresentacao]) FROM [Tarefa] WHERE [Tarefa].[ordemapresentacao] > @ordemapresentacao);
	END

	IF @idtmp IS NOT NULL
	BEGIN
		
		UPDATE [dbo].[Tarefa]
		SET [ordemapresentacao] = @ordemapresentacao
		WHERE [Tarefa].[idtarefa] = @idtmp

		UPDATE [dbo].[Tarefa]
		SET [ordemapresentacao] = @ordemapresentacaotmp
		WHERE [Tarefa].[idtarefa] = @idtarefa

	END
END
GO
/****** Object:  StoredProcedure [dbo].[altera_ordem_apresentacao]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Fabio Curtis Volpe
-- Create date: 09/05/2022
-- Description:	Altera ordem de apresentação
-- =============================================
CREATE PROCEDURE [dbo].[altera_ordem_apresentacao]
	@idtarefa INT,
	@idtarefa1 INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @ordemtmp INT;
	DECLARE @ordemtmp1 INT;

	SELECT @ordemtmp = [ordemapresentacao]
	FROM [dbo].[Tarefa]
	WHERE [Tarefa].[idtarefa] = @idtarefa

	SELECT @ordemtmp1 = [ordemapresentacao]
	FROM [dbo].[Tarefa]
	WHERE [Tarefa].[idtarefa] = @idtarefa1

	UPDATE [dbo].[Tarefa]
    SET [ordemapresentacao] = @ordemtmp1
    WHERE [Tarefa].[idtarefa] = @idtarefa


	UPDATE [dbo].[Tarefa]
    SET [ordemapresentacao] = @ordemtmp
    WHERE [Tarefa].[idtarefa] = @idtarefa1
	
END
GO
/****** Object:  StoredProcedure [dbo].[delete_tarefa]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Fabio Curtis Volpe
-- Create date: 09/05/2022
-- Description:	Apaga a Tarefa
-- =============================================
CREATE PROCEDURE [dbo].[delete_tarefa]
	-- Add the parameters for the stored procedure here
	@idtarefa INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    DELETE FROM [dbo].[Tarefa]
    WHERE [Tarefa].[idtarefa] = @idtarefa
	
END
GO
/****** Object:  StoredProcedure [dbo].[editar_tarefa]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Fabio Curtis Volpe
-- Create date: 09/05/2022
-- Description:	Edita uma tarefa
-- =============================================
CREATE PROCEDURE [dbo].[editar_tarefa]
	@idtarefa INT,
	@nometarefa VARCHAR(45), 
	@custo MONEY,
	@datalimite DATE,
	@ok AS TINYINT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   	DECLARE @idtmp AS INT;
	DECLARE @ordem AS INT;

	SET @ok = 0;
	SET @idtmp = NULL;

	SELECT @idtmp = [Tarefa].[idtarefa]
	FROM [dbo].[Tarefa]
	WHERE [Tarefa].[nometarefa] = @nometarefa

	IF @idtmp IS NULL OR @idtmp = @idtarefa
	BEGIN
		
		UPDATE [dbo].[Tarefa]
	    SET [nometarefa] = @nometarefa
		   ,[custo] = @custo
		   ,[datalimite] = @datalimite
  	    WHERE [Tarefa].[idtarefa] = @idtarefa

		SET @ok = 1
	END
	
	RETURN @ok
		
END
GO
/****** Object:  StoredProcedure [dbo].[nova_tarefa]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Fabio Curtis Volpe
-- Create date: 09/08/2022
-- Description:	Insere nova tarefa no sistema
-- =============================================
CREATE PROCEDURE [dbo].[nova_tarefa]
	@nometarefa VARCHAR(45),
	@custo MONEY,
	@datalimite DATE,
	@ok TINYINT OUTPUT
AS
BEGIN

	SET NOCOUNT ON;

	-- DECLARE @ok TINYINT;
	DECLARE @idtmp AS INT;
	DECLARE @ordem AS INT;

	SET @ok = 0;
	SET @idtmp = NULL;

	SELECT @idtmp = [Tarefa].[idtarefa]
	FROM [dbo].[Tarefa]
	WHERE [Tarefa].[nometarefa] = @nometarefa

	IF @idtmp IS NULL
	BEGIN
		SELECT TOP 1 @ordem = [Tarefa].[ordemapresentacao] FROM [Tarefa] ORDER BY [Tarefa].[ordemapresentacao] DESC
		IF @ordem IS NULL
		BEGIN
			SET @ordem = 1
		END
		ELSE 
		BEGIN
			SET @ordem += 1
		END

		INSERT INTO [dbo].[Tarefa]
           ([nometarefa]
           ,[custo]
           ,[datalimite]
		   ,[ordemapresentacao])
		 VALUES
			(@nometarefa,
			@custo,
			@datalimite,
			@ordem)

		SET @ok = 1
	END
	
	RETURN @ok
		
END
GO
/****** Object:  StoredProcedure [dbo].[seleciona_tarefa]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Fabio Curtis Volpe
-- Create date: 09/05/2022
-- Description:	Seleciona uma tarefa
-- =============================================
CREATE PROCEDURE [dbo].[seleciona_tarefa]
	-- Add the parameters for the stored procedure here
	@idtarefa INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT [idtarefa]
      ,[nometarefa]
      ,[custo]
      ,[datalimite]
	  ,[ordemapresentacao]
	FROM [dbo].[Tarefa]
	WHERE [Tarefa].[idtarefa] = @idtarefa
	
END
GO
/****** Object:  StoredProcedure [dbo].[seleciona_tarefas]    Script Date: 13/05/2022 11:23:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Fabio Curtis Volpe
-- Create date: 09/05/2022
-- Description:	Seleciona todas as tarefas por ordem de apresentação
-- =============================================
CREATE PROCEDURE [dbo].[seleciona_tarefas]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT [idtarefa]
      ,[nometarefa]
      ,[custo]
      ,[datalimite]
	  ,[ordemapresentacao]
	FROM [dbo].[Tarefa]
	ORDER BY [Tarefa].[ordemapresentacao] ASC

END
GO
USE [master]
GO
ALTER DATABASE [db] SET  READ_WRITE 
GO
