interface LanguageValue {
  java: string;
  cpp: string;
  c: string;
}

/**
 * 定义代码编辑器默认显示值
 */
const DefaultCodeEnum: LanguageValue = {
  java:
    "public class Main {\n" +
    "    public static void main(String[] args) {\n" +
    "        \n" +
    "    }\n" +
    "}",
  cpp:
    "#include <iostream>\n" +
    "using namespace std;\n" +
    "\n" +
    "int main()\n" +
    "{\n" +
    "\n" +
    "}",
  c: "#include <stdio.h>\n" + "\n" + "int main()\n" + "{\n" + "    \n" + "}",
};

export { LanguageValue, DefaultCodeEnum };
