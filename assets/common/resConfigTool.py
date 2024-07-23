from email.mime import base
import os
import sys
import re

exPaths = []  # 正则表达式,过滤的文件路径
fileCategorys = [".png", ".PNG", ".jpg", ".mp3",".wav", ".prefab", ".anim", ".labelatlas"] # 支持的文件格式

lines = []

def makeResDict(resDir):
    print("Read Name And Path Start, CurPath = " + resDir)
    if not os.path.exists(resDir):
        return True

    for (path, dirs, files) in os.walk(resDir):
        for filename in files:
            if filename.find(".meta") != -1:
                continue

            resName = ""
            for oneCategory in fileCategorys:
                if filename.find(oneCategory) != -1:
                    nameArr = filename.split(".")
                    resName = nameArr[0]
                    break

            if resName == "":
                continue

            #startIndex = path.index(".") + 7

            resPath = path.replace("\\", "/")
            startStr = "assets/"
            startIndex = resPath.index(startStr)+len(startStr)
            resPath = resPath[startIndex:]

            resPath = resPath + "/" + resName

            line = "\t" + resName + " : \"" + resPath + "\",\n"
            if line in lines:
                print("Read Name And Path Error!, res name repeat!  >>>" + resName)
                return False

            if isExPath(resPath) == False:
                lines.append(line)

    print("Read Name And Path Success, Path = " + resDir)
    return True


def isExPath(p):
    for ex in exPaths:
        if re.match(ex, p) != None:
            return True
    return False


def writeFile(outFilePath):
    print("Write Name And Path Start!")

    if not os.path.exists(os.path.dirname(outFilePath)):
        os.makedirs(os.path.dirname(outFilePath))

    dst = open(outFilePath, 'w', encoding='utf-8')
    dst.write("let ResourcesPath = {\n")
    for line in lines:
        dst.write(line)
        print(line)
    dst.write("}")
    dst.write("\n")
    dst.write("window['ResourcesPath'] = window['ResourcesPath'] || ResourcesPath;")
    print("Write Name And Path Success!")
    dst.close()

def main():
    # 设置相关路径
    curPath = os.path.abspath(__file__)
    parentPath = os.path.dirname(curPath)
    assetPath = os.path.dirname(parentPath)

    i18nResPath = "%s/res_i18n" % assetPath # 需要打包ab的资源文件夹
    commonResPath = "%s/common_res" % assetPath # 需要打包ab的资源文件夹
    gameResPath = "%s/game_res" % assetPath # 需要打包ab的资源文件夹
    resourcesPath = "%s/resources" % assetPath # resources下的资源
    outFilePath = "%s/scripts/autoGen/ResourcesPath.ts" % assetPath #js输出路径

    # 如果命令行有输入参数，则处理对应路径的资源
    # arglen = len(sys.argv)
    # if arglen > 1 :
    #     resPath = sys.argv[1]
    # if arglen > 2 :
    #     resourcesPath = sys.argv[2]
    # if arglen > 3 :
    #     outFilePath = sys.argv[3]

    isI18nResOk = makeResDict(i18nResPath)
    isCommonResOk = makeResDict(commonResPath)
    isGameResOk = makeResDict(gameResPath)
    isResourcesOk = makeResDict(resourcesPath)
    if isI18nResOk and isCommonResOk and isGameResOk and isResourcesOk:
        lines.sort()
        writeFile(outFilePath)

    os.system('exit')


if __name__ == '__main__':
    main()
    
    

